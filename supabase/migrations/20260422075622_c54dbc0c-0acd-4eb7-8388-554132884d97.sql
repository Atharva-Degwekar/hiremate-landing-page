
-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Subscriptions (simulated trial + plan)
create type public.plan_tier as enum ('free','pro','premium');
create type public.sub_status as enum ('trialing','active','canceled');

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  plan plan_tier not null default 'free',
  status sub_status not null default 'active',
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  card_last4 text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users view own subscription" on public.subscriptions for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own subscription" on public.subscriptions for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own subscription" on public.subscriptions for update to authenticated using (auth.uid() = user_id);

-- Helper: is premium (pro/premium AND not expired OR trialing)
create or replace function public.is_premium(_user uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.subscriptions s
    where s.user_id = _user
      and s.plan in ('pro','premium')
      and (
        (s.status = 'trialing' and s.trial_ends_at > now()) or
        (s.status = 'active' and (s.current_period_end is null or s.current_period_end > now()))
      )
  );
$$;

-- Interview sessions
create table public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  difficulty text not null default 'mid',
  status text not null default 'in_progress',
  overall_score int,
  category_scores jsonb,
  strengths text[],
  weaknesses text[],
  next_steps text[],
  benchmark_percentile int,
  filler_count int,
  pace_wpm int,
  duration_seconds int,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.interview_sessions enable row level security;

create policy "Users view own sessions" on public.interview_sessions for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own sessions" on public.interview_sessions for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own sessions" on public.interview_sessions for update to authenticated using (auth.uid() = user_id);

-- Per-question turns
create table public.interview_turns (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_index int not null,
  question text not null,
  answer text,
  score int,
  feedback text,
  highlights jsonb,
  created_at timestamptz not null default now()
);

alter table public.interview_turns enable row level security;

create policy "Users view own turns" on public.interview_turns for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own turns" on public.interview_turns for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own turns" on public.interview_turns for update to authenticated using (auth.uid() = user_id);
