import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "./Logo";

export default async function SiteHeader() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet/30">
        <Logo />
      </Link>
      <nav className="flex items-center gap-1 text-[15px] font-medium sm:gap-3">
        <Link href="/pricing" className="rounded-lg px-3 py-2 text-ink-soft hover:text-ink">
          Pricing
        </Link>
        {user ? (
          <span className="hidden max-w-[14rem] truncate px-3 py-2 text-muted sm:inline">{user.email}</span>
        ) : (
          <Link href="/login" className="rounded-lg px-3 py-2 text-ink-soft hover:text-ink">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
