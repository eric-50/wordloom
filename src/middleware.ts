import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Skip static assets and the Stripe webhook (it has no user session).
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks).*)",
  ],
};
