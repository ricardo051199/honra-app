-- 005_transactions.sql
create table public.transactions (
    id uuid primary key default gen_random_uuid(),

    order_id uuid references public.orders(id),
    escrow_id uuid references public.escrows(id),

    tx_hash text not null unique,

    type text not null
        check (
            type in (
                'create_order',
                'approve',
                'fund',
                'ship',
                'confirm_delivery',
                'release',
                'refund',
                'open_dispute',
                'resolve_dispute'
            )
        ),

    from_address text,
    to_address text,

    amount_usdc numeric(20,6),

    block_number bigint,
    block_hash text,

    status text not null default 'pending'
        check (
            status in ('pending', 'confirmed', 'failed')
        ),

    gas_used numeric(78,0),
    gas_price numeric(78,0),

    error_message text,

    confirmed_at timestamptz,
    created_at timestamptz not null default now()
);

create index idx_transactions_order on public.transactions(order_id);
create index idx_transactions_escrow on public.transactions(escrow_id);
create index idx_transactions_type on public.transactions(type);
