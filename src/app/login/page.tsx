"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/components/Logo";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/pricing";
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ tone: "error" | "info"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignUp = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${next}` },
      });
      setMessage(
        error
          ? { tone: "error", text: error.message }
          : { tone: "info", text: `We sent a confirmation link to ${email}. Open it to finish signing up.` },
      );
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) {
        router.push(next);
        router.refresh();
        return;
      }
      setMessage({ tone: "error", text: "That email and password don’t match. Check them and try again." });
    }
    setLoading(false);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <main className="flex flex-col px-5 py-6 sm:px-10">
        <Link href="/" className="self-start rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/30">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {isSignUp ? "Start writing free" : "Welcome back"}
          </h1>
          <p className="mt-2 text-ink-soft">
            {isSignUp ? "10 free drafts a month. No card needed." : "Sign in to pick up where you left off."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Work email
              </label>
              <input id="email" type="email" required autoComplete="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder={isSignUp ? "At least 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field"
              />
            </div>
            {message && (
              <p
                role={message.tone === "error" ? "alert" : "status"}
                className={`rounded-xl px-3.5 py-2.5 text-sm ${
                  message.tone === "error" ? "border border-red-200 bg-red-50 text-red-800" : "border border-violet/20 bg-violet-tint text-ink"
                }`}
              >
                {message.text}
              </p>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (isSignUp ? "Creating account…" : "Signing in…") : isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-sm text-muted">
            {isSignUp ? "Already have an account?" : "New to Wordloom?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode(isSignUp ? "signin" : "signup");
                setMessage(null);
              }}
              className="rounded font-semibold text-violet hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet/40"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
      </main>

      <aside className="hidden flex-col justify-end bg-ink p-14 text-white lg:flex">
        <div className="max-w-lg">
          <p className="text-lg text-white/50 line-through decoration-2">We are excited to announce our new product.</p>
          <p className="mt-4 font-display text-4xl leading-tight font-medium tracking-tight">
            Meet the tool that writes your launch email{" "}
            <span className="mark text-ink">before your coffee cools</span>.
          </p>
          <p className="mt-8 text-white/65">Paste your notes. Pick a format. Get a draft in your brand’s voice.</p>
        </div>
      </aside>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
