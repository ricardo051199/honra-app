-- 002_users.sql
create table public.users (
    id uuid primary key default gen_random_uuid(),

    wallet_address text not null unique,

    display_name text,
    email text,

    role text not null default 'buyer'
        check (role in ('buyer', 'seller', 'admin')),

    avatar_url text,

    is_active boolean not null default true,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_users_wallet
on public.users(lower(wallet_address));
