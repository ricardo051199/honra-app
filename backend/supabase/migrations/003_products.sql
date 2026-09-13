-- 003_products.sql
create table public.products (
    id uuid primary key default gen_random_uuid(),

    seller_id uuid not null references public.users(id),

    title text not null,
    description text not null,

    price_usdc numeric(20,6) not null check (price_usdc > 0),

    stock integer not null default 0 check (stock >= 0),

    category text,

    image_url text,

    status text not null default 'active'
        check (status in ('active', 'inactive', 'draft')),

    rating numeric(3,2) default 0,
    review_count integer default 0,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_products_seller on public.products(seller_id);
create index idx_products_status on public.products(status);
create index idx_products_category on public.products(category);
