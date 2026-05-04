-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Leads table
create table public.leads (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  email text not null,
  message text not null,

  source text not null default 'form'
    check (source in ('form', 'chat', 'api')),

  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),

  metadata jsonb,

  created_at timestamptz not null default now()
);

-- Indexes
create index idx_leads_created_at on public.leads (created_at desc);
create index idx_leads_status on public.leads (status);
create index idx_leads_source on public.leads (source);
create index idx_leads_email on public.leads (email);

-- Enable RLS
alter table public.leads enable row level security;

-- Allow public (anon) to insert leads
create policy "Anyone can insert leads"
on public.leads
for insert
with check (true);

-- Only authenticated users can read leads
create policy "Authenticated users can view leads"
on public.leads
for select
using (auth.role() = 'authenticated');

-- Only authenticated users can update leads
create policy "Authenticated users can update leads"
on public.leads
for update
using (auth.role() = 'authenticated');

-- Optional: delete
create policy "Authenticated users can delete leads"
on public.leads
for delete
using (auth.role() = 'authenticated');
