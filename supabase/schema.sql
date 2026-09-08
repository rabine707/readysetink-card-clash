-- Card Clash owns only objects prefixed with card_clash_.
create extension if not exists pgcrypto;

create table if not exists public.card_clash_cards (
  id text primary key,
  name text not null,
  version text,
  image_url text not null,
  set_code text,
  set_name text,
  collector_number text,
  language text,
  promo_source text,
  promo_source_category text,
  ink text,
  rarity text,
  classifications text[] not null default '{}',
  released_at date,
  is_active boolean not null default true,
  rating numeric(10,2) not null default 1500,
  wins integer not null default 0 check (wins >= 0),
  losses integer not null default 0 check (losses >= 0),
  ties integer not null default 0 check (ties >= 0),
  battles integer not null default 0 check (battles >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (battles = wins + losses + ties)
);

-- Keep existing installations upgradeable when this schema is reapplied.
alter table public.card_clash_cards add column if not exists collector_number text;
alter table public.card_clash_cards add column if not exists language text;
alter table public.card_clash_cards add column if not exists promo_source text;
alter table public.card_clash_cards add column if not exists promo_source_category text;

create table if not exists public.card_clash_votes (
  id uuid primary key default gen_random_uuid(),
  clash_id uuid not null unique,
  left_card_id text not null references public.card_clash_cards(id) on delete restrict,
  right_card_id text not null references public.card_clash_cards(id) on delete restrict,
  result text not null check (result in ('left', 'right', 'tie', 'skip')),
  session_id uuid not null,
  created_at timestamptz not null default now(),
  check (left_card_id <> right_card_id)
);

create index if not exists card_clash_cards_rank_idx
  on public.card_clash_cards (rating desc, battles desc) where is_active;
create index if not exists card_clash_cards_exposure_idx
  on public.card_clash_cards (battles asc, rating asc) where is_active;
create index if not exists card_clash_votes_created_idx
  on public.card_clash_votes (created_at desc);
create index if not exists card_clash_votes_session_idx
  on public.card_clash_votes (session_id, created_at desc);
create index if not exists card_clash_votes_left_card_idx
  on public.card_clash_votes (left_card_id);
create index if not exists card_clash_votes_right_card_idx
  on public.card_clash_votes (right_card_id);

alter table public.card_clash_cards enable row level security;
alter table public.card_clash_votes enable row level security;
revoke all on table public.card_clash_cards from anon, authenticated;
revoke all on table public.card_clash_votes from anon, authenticated;
grant all on table public.card_clash_cards to service_role;
grant all on table public.card_clash_votes to service_role;

create or replace function public.record_card_clash_vote(
  p_clash_id uuid,
  p_left_card_id text,
  p_right_card_id text,
  p_result text,
  p_session_id uuid
)
returns table(left_rating numeric, right_rating numeric, ranked boolean)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_left public.card_clash_cards%rowtype;
  v_right public.card_clash_cards%rowtype;
  v_expected_left numeric;
  v_score_left numeric;
  v_new_left numeric;
  v_new_right numeric;
  v_recent_votes integer;
  v_k constant numeric := 24;
  v_votes_per_minute constant integer := 30;
begin
  if p_left_card_id is null or p_right_card_id is null or p_left_card_id = p_right_card_id then
    raise exception 'Two different cards are required' using errcode = '22023';
  end if;
  if p_result is null or p_result not in ('left', 'right', 'tie', 'skip') then
    raise exception 'Invalid Card Clash result' using errcode = '22023';
  end if;

  -- Serialize requests for one anonymous browser session so concurrent calls
  -- cannot race past the rolling per-user limit.
  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(p_session_id::text, 0)
  );
  select count(*) into v_recent_votes
    from public.card_clash_votes
    where session_id = p_session_id
      and created_at > pg_catalog.now() - interval '1 minute';
  if v_recent_votes >= v_votes_per_minute then
    raise exception 'CARD_CLASH_RATE_LIMIT' using errcode = 'P0001';
  end if;

  -- Consistent lock order prevents concurrent votes from deadlocking.
  perform 1 from public.card_clash_cards
    where id in (p_left_card_id, p_right_card_id)
    order by id for update;
  select * into v_left from public.card_clash_cards where id = p_left_card_id and is_active;
  select * into v_right from public.card_clash_cards where id = p_right_card_id and is_active;
  if v_left.id is null or v_right.id is null then
    raise exception 'Card unavailable' using errcode = 'P0002';
  end if;

  -- The unique clash_id makes a double click/retry idempotent at the database boundary.
  insert into public.card_clash_votes(clash_id,left_card_id,right_card_id,result,session_id)
  values (p_clash_id,p_left_card_id,p_right_card_id,p_result,p_session_id);

  if p_result = 'skip' then
    return query select v_left.rating, v_right.rating, false;
    return;
  end if;

  v_score_left := case p_result when 'left' then 1 when 'right' then 0 else 0.5 end;
  v_expected_left := 1 / (1 + power(10::numeric, (v_right.rating - v_left.rating) / 400));
  v_new_left := round(v_left.rating + v_k * (v_score_left - v_expected_left), 2);
  v_new_right := round(v_right.rating + v_k * ((1 - v_score_left) - (1 - v_expected_left)), 2);

  update public.card_clash_cards set
    rating = v_new_left,
    wins = wins + case when p_result = 'left' then 1 else 0 end,
    losses = losses + case when p_result = 'right' then 1 else 0 end,
    ties = ties + case when p_result = 'tie' then 1 else 0 end,
    battles = battles + 1,
    updated_at = now()
  where id = p_left_card_id;

  update public.card_clash_cards set
    rating = v_new_right,
    wins = wins + case when p_result = 'right' then 1 else 0 end,
    losses = losses + case when p_result = 'left' then 1 else 0 end,
    ties = ties + case when p_result = 'tie' then 1 else 0 end,
    battles = battles + 1,
    updated_at = now()
  where id = p_right_card_id;

  return query select v_new_left, v_new_right, true;
end;
$$;

revoke execute on function public.record_card_clash_vote(uuid,text,text,text,uuid) from public, anon, authenticated;
grant execute on function public.record_card_clash_vote(uuid,text,text,text,uuid) to service_role;
