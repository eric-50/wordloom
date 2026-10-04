import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";

// Postgres unique_violation: the event id is already in the ledger.
const UNIQUE_VIOLATION = "23505";

// Webhooks have no user session, so they use the service role key, which
// bypasses RLS. Never import this client into code that runs in the browser.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export async function POST(req: Request) {
  // Signature verification needs the exact bytes Stripe signed, so read the raw
  // body. Parsing it as JSON first changes the payload and the check fails.
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${message}`);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  // Claim the event before doing any work. The primary key makes this atomic,
  // so two concurrent deliveries of the same event can't both get through.
  const { error: claimError } = await supabaseAdmin
    .from("stripe_events")
    .insert({ id: event.id, type: event.type });

  if (claimError?.code === UNIQUE_VIOLATION) {
    return NextResponse.json({ received: true, duplicate: true });
  }
  if (claimError) {
    console.error(`Failed to record Stripe event ${event.id}`, claimError);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session.client_reference_id ?? session.metadata?.user_id;

  if (!userId) {
    console.error(`Checkout session ${session.id} has no user id`);
    return NextResponse.json({ received: true });
  }

  const { data: updated, error } = await supabaseAdmin
    .from("profiles")
    .update({
      subscription_tier: "pro",
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select("id");

  if (error || !updated?.length) {
    console.error(`Failed to upgrade profile ${userId} for event ${event.id}`, error ?? "no matching profile");
    // Release the claim so Stripe's retry can process this event again.
    await supabaseAdmin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Database update failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
