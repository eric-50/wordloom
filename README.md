# AI Copywriter SaaS

Next.js 14 (App Router) + Tailwind, with Supabase auth/database and Stripe subscriptions.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in your Supabase and Stripe keys.
3. In Stripe, create a **Pro** product with a $29/month recurring price and put its ID in `STRIPE_PRO_PRICE_ID`.
4. Run `supabase/migrations/0001_profiles.sql` in the Supabase SQL editor (or `supabase db push`).
5. `npm run dev`
6. Forward webhooks locally and copy the printed signing secret into `STRIPE_WEBHOOK_SECRET`:

   ```
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

## How it works

- `/pricing` shows the plans. **Subscribe to Pro ($29/mo)** calls `POST /api/checkout`, which creates a Stripe Checkout session for the signed-in user and redirects to it.
- Stripe sends `checkout.session.completed` to `POST /api/webhooks/stripe`, which sets `profiles.subscription_tier = 'pro'` for that user.
