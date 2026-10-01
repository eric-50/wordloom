// Sends a signed checkout.session.completed event to the local webhook, the
// same way Stripe would. No Stripe account needed: the signature is computed
// with STRIPE_WEBHOOK_SECRET from .env.local.
//
// Usage: node scripts/send-test-webhook.mjs [user-email] [--event-id evt_...]

import { readFileSync } from "node:fs";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => /^[A-Z_]+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

const args = process.argv.slice(2);
const eventIdFlag = args.indexOf("--event-id");
const eventId = eventIdFlag >= 0 ? args[eventIdFlag + 1] : `evt_test_${Date.now()}`;
const email = args.find((a, i) => !a.startsWith("--") && i !== eventIdFlag + 1);

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

let query = admin.from("profiles").select("id, email, subscription_tier");
query = email ? query.eq("email", email) : query.order("id").limit(1);
const { data: profiles, error } = await query;
if (error || !profiles?.length) {
  console.error(email ? `No profile for ${email}.` : "No profiles yet. Sign up in the app first.");
  process.exit(1);
}
const profile = profiles[0];
console.log(`User:   ${profile.email} (${profile.id})`);
console.log(`Before: subscription_tier = ${profile.subscription_tier}`);

const payload = JSON.stringify({
  id: eventId,
  object: "event",
  type: "checkout.session.completed",
  created: Math.floor(Date.now() / 1000),
  data: {
    object: {
      id: `cs_test_${Date.now()}`,
      object: "checkout.session",
      mode: "subscription",
      client_reference_id: profile.id,
      metadata: { user_id: profile.id },
      customer: "cus_test_local",
      subscription: "sub_test_local",
      payment_status: "paid",
    },
  },
});

const signature = new Stripe("sk_test_unused").webhooks.generateTestHeaderString({
  payload,
  secret: env.STRIPE_WEBHOOK_SECRET,
});

const res = await fetch(`${env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/webhooks/stripe`, {
  method: "POST",
  headers: { "content-type": "application/json", "stripe-signature": signature },
  body: payload,
});
console.log(`Event:  ${eventId}`);
console.log(`Webhook responded ${res.status}: ${await res.text()}`);

const { data: after } = await admin.from("profiles").select("subscription_tier").eq("id", profile.id).single();
console.log(`After:  subscription_tier = ${after?.subscription_tier}`);
