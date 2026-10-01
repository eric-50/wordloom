import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubscribeButton from "./SubscribeButton";

const FREE_FEATURES = ["10 generations per month", "Blog intros and product blurbs", "Copy to clipboard"];
const PRO_FEATURES = [
  "Unlimited generations",
  "Ads, emails, landing pages and more",
  "Brand voice presets",
  "Priority generation speed",
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams: { checkout?: string };
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let tier: string | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();
    tier = data?.subscription_tier ?? "free";
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Write better copy, faster
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          Start free. Upgrade when you need unlimited drafts.
        </p>
      </div>

      {searchParams.checkout === "success" && (
        <p className="mx-auto mt-8 max-w-md rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-800">
          Payment received. Your Pro plan will be active in a few seconds.
        </p>
      )}
      {searchParams.checkout === "cancelled" && (
        <p className="mx-auto mt-8 max-w-md rounded-lg bg-slate-100 px-4 py-3 text-center text-sm text-slate-700">
          Checkout cancelled. You haven’t been charged.
        </p>
      )}

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900">Free</h2>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            $0<span className="text-base font-medium text-slate-500">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            {FREE_FEATURES.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          {!user && (
            <Link
              href="/login"
              className="mt-8 block rounded-lg border border-slate-300 px-4 py-3 text-center font-semibold text-slate-800 hover:bg-slate-50"
            >
              Create a free account
            </Link>
          )}
        </section>

        <section className="rounded-2xl border-2 border-violet-600 bg-white p-8 shadow-lg shadow-violet-600/10">
          <h2 className="text-lg font-semibold text-violet-700">Pro</h2>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            $29<span className="text-base font-medium text-slate-500">/mo</span>
          </p>
          <ul className="mt-6 space-y-3 text-slate-700">
            {PRO_FEATURES.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          <div className="mt-8">
            {tier === "pro" ? (
              <p className="rounded-lg bg-violet-50 px-4 py-3 text-center font-semibold text-violet-700">
                You’re on Pro
              </p>
            ) : (
              <SubscribeButton />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
