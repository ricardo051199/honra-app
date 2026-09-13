-- 006_disputes.sql
create table public.disputes (
    id uuid primary key default gen_random_uuid(),

    order_id uuid not null
        references public.orders(id),

    opened_by uuid not null
        references public.users(id),

    reason text not null
        check (
            reason in (
                'not_received',
                'not_as_described',
                'wrong_item',
                'seller_cancelled',
                'other'
            )
        ),

    description text not null,

    status text not null default 'open'
        check (
            status in (
                'open',
                'under_review',
                'resolved'
            )
        ),

    resolution text
        check (
            resolution is null
            or resolution in (
                'refunded',
                'released_to_seller'
            )
        ),

    resolution_tx_hash text,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_disputes_order on public.disputes(order_id);
create index idx_disputes_status on public.disputes(status);

create table public.dispute_events (
    id uuid primary key default gen_random_uuid(),

    dispute_id uuid not null
        references public.disputes(id)
        on delete cascade,

    type text not null,

    label text not null,

    description text,

    actor_id uuid references public.users(id),

    tx_hash text,

    created_at timestamptz not null default now()
);

create index idx_dispute_events_dispute on public.dispute_events(dispute_id);

create table public.dispute_evidence (
    id uuid primary key default gen_random_uuid(),

    dispute_id uuid not null
        references public.disputes(id)
        on delete cascade,

    uploaded_by uuid not null
        references public.users(id),

    file_path text not null,
    file_name text not null,
    mime_type text,
    file_size bigint,

    created_at timestamptz not null default now()
);

create index idx_dispute_evidence_dispute on public.dispute_evidence(dispute_id);
