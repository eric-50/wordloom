import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import SubscribeButton from "./SubscribeButton";

export const metadata: Metadata = { title: "Pricing" };

const FREE_FEATURES = ["10 drafts a month", "Blog intros and product descriptions", "One brand voice"];
const PRO_FEATURES = [
  "Unlimited drafts",
  "Ads, emails, landing pages and social posts",
  "Up to 5 brand voices",
  "Rewrite any draft in a different tone",
  "Priority speed when it’s busy",
];
const FAQ = [
  {
    q: "Can I cancel any time?",
    a: "Yes. Cancel from your account and you keep Pro until the end of the month you’ve paid for.",
  },
  {
    q: "What happens to my drafts if I go back to Free?",
    a: "Nothing is deleted. You can still read and copy everything you wrote on Pro.",
  },
  {
    q: "Do you train AI models on my copy?",
    a: "No. Your notes and drafts are only used to write for you.",
  },
];

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} aria-hidden="true">
      <path d="m5 10.5 3.2 3L15 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default async function PricingPage({ searchParams }: { searchParams: { checkout?: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let tier: string | null = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("subscription_tier").eq("id", user.id).single();
    tier = data?.subscription_tier ?? "free";
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 pt-10 pb-24 sm:px-8 sm:pt-16">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-semibold tracking-[-0.02em] sm:text-6xl">
            Pay for <span className="mark">words that work</span>
          </h1>
          <p className="mt-5 text-lg text-ink-soft">Start free. Upgrade when one draft a few days isn’t enough.</p>
        </div>

        {searchParams.checkout === "success" && (
          <p role="status" className="mt-8 max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900">
            Payment received. Your Pro plan switches on within a few seconds. Refresh this page to see it.
          </p>
        )}
        {searchParams.checkout === "cancelled" && (
          <p role="status" className="mt-8 max-w-xl rounded-xl border border-line bg-white px-4 py-3 text-ink-soft">
            Checkout cancelled. You haven’t been charged.
          </p>
        )}

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-[1fr_1.25fr]">
          <section className="flex flex-col rounded-3xl border border-line bg-white p-8 sm:p-10">
            <h2 className="text-lg font-semibold">Free</h2>
            <p className="mt-1 text-muted">For trying it on a real project.</p>
            <p className="mt-8 font-display text-6xl font-semibold tracking-tight">
              $0<span className="ml-1 font-sans text-lg font-medium text-muted">/month</span>
            </p>
            <ul className="mt-8 space-y-3 text-ink-soft">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="text-muted" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              {user ? (
                <p className="rounded-xl bg-canvas px-4 py-3 text-center font-medium text-muted">
                  {tier === "pro" ? "Included in Pro" : "Your current plan"}
                </p>
              ) : (
                <Link href="/login" className="btn-secondary w-full">
                  Create a free account
                </Link>
              )}
            </div>
          </section>

          <section className="relative flex flex-col overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Pro</h2>
              <span className="rounded-full bg-highlighter px-3 py-1 text-sm font-semibold text-ink">Best for daily writing</span>
            </div>
            <p className="mt-1 text-white/65">For marketers who write every day.</p>
            <p className="mt-8 font-display text-6xl font-semibold tracking-tight">
              $29<span className="ml-1 font-sans text-lg font-medium text-white/60">/month</span>
            </p>
            <ul className="mt-8 grid gap-3 text-white/85 sm:grid-cols-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex gap-3">
                  <Check className="text-highlighter" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              {tier === "pro" ? (
                <p className="rounded-xl bg-white/10 px-4 py-3 text-center font-semibold">You’re on Pro</p>
              ) : (
                <SubscribeButton />
              )}
              <p className="mt-3 text-center text-sm text-white/55">Secure checkout with Stripe. Cancel any time.</p>
            </div>
          </section>
        </div>

        <section className="mt-24 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Questions</h2>
          <dl className="divide-y divide-line border-y border-line">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="py-6">
                <dt className="font-semibold">{q}</dt>
                <dd className="mt-2 text-ink-soft">{a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
