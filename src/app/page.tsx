import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

const EXAMPLES = [
  {
    format: "Facebook ad",
    before: "Our software helps businesses save time with automation.",
    after: "Your team spent 11 hours on spreadsheets last week. Next week, spend zero.",
  },
  {
    format: "Email subject line",
    before: "Newsletter: October updates",
    after: "We broke something (on purpose)",
  },
  {
    format: "Product description",
    before: "High-quality ceramic mug, 12oz, dishwasher safe.",
    after: "Holds exactly one strong coffee and survives every dishwasher you’ll ever own.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-6xl px-5 pt-12 pb-20 sm:px-8 sm:pt-20 lg:pb-28">
          <div className="max-w-3xl">
            <p className="text-lg text-muted line-through decoration-2 animate-strike motion-strike">
              Generate high-quality marketing content with AI.
            </p>
            <h1 className="mt-4 font-display text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.02em] text-balance sm:text-7xl">
              Copy that sounds like you,{" "}
              <span className="mark animate-sweep motion-sweep">on your best day.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
              Paste your rough notes. Wordloom turns them into ads, emails and landing pages in your brand’s voice,
              ready to ship.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/login" className="btn-primary">
                Start writing free
              </Link>
              <Link href="/pricing" className="btn-secondary">
                See pricing
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted">10 free drafts a month. No card needed.</p>
          </div>
        </section>

        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Same idea. Better words.
            </h2>
            <p className="mt-3 max-w-xl text-ink-soft">Example rewrites in three of the formats Wordloom writes.</p>

            <div className="mt-12 divide-y divide-line border-y border-line">
              {EXAMPLES.map((ex) => (
                <article key={ex.format} className="grid gap-4 py-8 md:grid-cols-[12rem_1fr_1fr] md:gap-10">
                  <h3 className="text-sm font-semibold text-muted">{ex.format}</h3>
                  <p className="text-ink-soft/70 line-through decoration-[#E5484D]/60">{ex.before}</p>
                  <p className="font-display text-xl leading-snug font-medium">{ex.after}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-8 rounded-3xl bg-ink px-8 py-12 text-white sm:px-12 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Write your next launch faster.</h2>
              <p className="mt-3 text-white/70">Unlimited drafts on Pro, $29 a month. Cancel any time.</p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-highlighter px-6 py-3 font-semibold text-ink transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-highlighter/50"
            >
              Get Pro
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-5 py-8 text-sm text-muted sm:px-8">© 2026 Wordloom</div>
      </footer>
    </>
  );
}
