import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">AI Copywriter</h1>
      <p className="mt-4 text-lg text-slate-600">
        Generate ads, emails and landing-page copy in your brand’s voice.
      </p>
      <Link
        href="/pricing"
        className="mt-8 rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-500"
      >
        See pricing
      </Link>
    </main>
  );
}
