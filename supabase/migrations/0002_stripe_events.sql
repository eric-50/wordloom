-- Ledger of Stripe webhook events we've already handled, so retries and
-- duplicate deliveries are processed exactly once.
create table public.stripe_events (
  id text primary key,            -- Stripe event.id (evt_...)
  type text not null,
  processed_at timestamptz not null default now()
);

-- Only the server (service role, which bypasses RLS) touches this table.
-- RLS with no policies blocks anon and authenticated clients entirely.
alter table public.stripe_events enable row level security;
