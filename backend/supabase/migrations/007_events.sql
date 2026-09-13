-- 007_events.sql
create table public.blockchain_events (
    id uuid primary key default gen_random_uuid(),

    contract_address text not null,

    tx_hash text not null,

    block_number bigint not null,

    log_index integer not null,

    event_name text not null,

    event_data jsonb not null,

    processed boolean not null default false,

    created_at timestamptz not null default now(),

    unique(tx_hash, log_index)
);

create index idx_blockchain_events_contract on public.blockchain_events(contract_address);
create index idx_blockchain_events_processed on public.blockchain_events(processed);
