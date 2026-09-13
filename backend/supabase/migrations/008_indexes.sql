-- 008_indexes.sql

-- Tracks the last block fully processed by the indexer, per contract, so a
-- restart resumes instead of re-scanning from genesis or `latest`.
create table public.indexer_cursors (
    contract_address text primary key,
    last_block numeric(78,0) not null,
    updated_at timestamptz not null default now()
);

-- Generic updated_at trigger, applied to every table that has the column.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create trigger trg_escrows_updated_at
before update on public.escrows
for each row execute function public.set_updated_at();

create trigger trg_disputes_updated_at
before update on public.disputes
for each row execute function public.set_updated_at();
