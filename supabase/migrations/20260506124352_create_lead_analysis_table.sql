-- Lead Analysis table
create table public.lead_analysis (
  id uuid primary key default gen_random_uuid(),

  lead_id uuid not null unique
    references public.leads(id)
    on delete cascade,

  score integer not null
    check (score >= 0 and score <= 100),

  label text not null
    check (label in ('cold', 'warm', 'hot')),

  intent_summary text not null,
  suggested_action text not null,

  raw_response jsonb not null,
  model text not null,

  created_at timestamptz not null default now()
);

-- Index for joins
create index idx_lead_analysis_lead_id
on public.lead_analysis (lead_id);

-- Enable RLS
alter table public.lead_analysis enable row level security;

-- Allow authenticated users to read analysis
create policy "Authenticated users can view analysis"
on public.lead_analysis
for select
using (auth.role() = 'authenticated');

-- No public insert/update via client
-- (AI writes happen via backend / service role)
