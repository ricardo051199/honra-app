-- 004_orders.sql
create table public.orders (
    id uuid primary key default gen_random_uuid(),

    order_number text not null unique,

    buyer_id uuid not null references public.users(id),
    seller_id uuid not null references public.users(id),
    product_id uuid not null references public.products(id),

    buyer_address text not null,
    seller_address text not null,

    amount_usdc numeric(20,6) not null,

    status text not null default 'pending_payment'
        check (
            status in (
                'pending_payment',
                'funds_locked',
                'shipped',
                'delivered',
                'completed',
                'disputed',
                'refunded',
                'cancelled'
            )
        ),

    blockchain_order_id numeric(78,0),

    escrow_contract text not null,

    created_tx_hash text,
    funded_tx_hash text,
    shipped_tx_hash text,
    delivered_tx_hash text,
    completed_tx_hash text,
    refunded_tx_hash text,
    disputed_tx_hash text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_orders_buyer on public.orders(buyer_id);
create index idx_orders_seller on public.orders(seller_id);
create index idx_orders_status on public.orders(status);
create index idx_orders_blockchain_order_id on public.orders(blockchain_order_id);

create table public.escrows (
    id uuid primary key default gen_random_uuid(),

    order_id uuid not null unique
        references public.orders(id),

    blockchain_order_id numeric(78,0) not null,

    contract_address text not null,

    buyer_address text not null,
    seller_address text not null,

    amount_usdc numeric(20,6) not null,

    status text not null
        check (
            status in (
                'created',
                'funded',
                'shipped',
                'delivered',
                'disputed',
                'released',
                'refunded'
            )
        ),

    funded_at timestamptz,
    shipped_at timestamptz,
    delivered_at timestamptz,
    released_at timestamptz,
    refunded_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.shipping (
    id uuid primary key default gen_random_uuid(),

    order_id uuid not null references public.orders(id) on delete cascade,

    carrier text not null,
    tracking_number text not null,
    tracking_url text,

    created_at timestamptz not null default now()
);

create index idx_shipping_order on public.shipping(order_id);
