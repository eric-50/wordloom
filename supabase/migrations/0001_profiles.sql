create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile. Writes to subscription fields happen
-- server-side only, so there is no insert/update policy for clients.
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Create a profile row whenever someone signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
