create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum (
      'super_admin',
      'agency_admin',
      'sales',
      'operations',
      'marketing'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum (
      'new',
      'contacted',
      'quoted',
      'won',
      'lost'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'policy_status') then
    create type public.policy_status as enum (
      'draft',
      'quoted',
      'active',
      'renewal_due',
      'expired',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum (
      'todo',
      'in_progress',
      'waiting',
      'done',
      'cancelled'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'document_type') then
    create type public.document_type as enum (
      'quote_pdf',
      'policy_pdf',
      'claim_document',
      'payment_receipt',
      'other'
    );
  end if;
end $$;

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  phone text,
  email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agency_memberships (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid references public.agencies(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  unique (agency_id, profile_id)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_type text not null default 'individual',
  full_name text not null,
  company_name text,
  national_id text,
  tax_number text,
  phone text,
  email text,
  city text,
  notes text,
  assigned_membership_id uuid references public.agency_memberships(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  branch text not null,
  insurer_name text not null,
  policy_number text,
  status public.policy_status not null default 'draft',
  start_date date,
  end_date date,
  premium_amount numeric(12, 2) not null default 0,
  renewal_reminder_at timestamptz,
  pdf_url text,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  full_name text not null,
  phone text,
  email text,
  source text not null,
  campaign_name text,
  product_interest text,
  quality_score integer not null default 0 check (quality_score between 0 and 100),
  status public.lead_status not null default 'new',
  assigned_membership_id uuid references public.agency_memberships(id) on delete set null,
  last_action_note text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  policy_id uuid references public.policies(id) on delete set null,
  title text not null,
  description text,
  status public.task_status not null default 'todo',
  due_at timestamptz,
  assigned_membership_id uuid references public.agency_memberships(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  policy_id uuid references public.policies(id) on delete set null,
  author_profile_id uuid references public.profiles(id) on delete set null,
  topic text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  agency_id uuid not null references public.agencies(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  policy_id uuid references public.policies(id) on delete set null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  title text not null,
  document_type public.document_type not null default 'other',
  file_url text not null,
  file_size_bytes bigint,
  created_at timestamptz not null default now()
);

create index if not exists idx_agency_memberships_profile_id on public.agency_memberships(profile_id);
create index if not exists idx_customers_agency_id on public.customers(agency_id);
create index if not exists idx_policies_agency_id on public.policies(agency_id);
create index if not exists idx_policies_customer_id on public.policies(customer_id);
create index if not exists idx_leads_agency_id on public.leads(agency_id);
create index if not exists idx_tasks_agency_id on public.tasks(agency_id);
create index if not exists idx_messages_agency_id on public.messages(agency_id);
create index if not exists idx_documents_agency_id on public.documents(agency_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_agencies_updated_at on public.agencies;
create trigger trg_agencies_updated_at
before update on public.agencies
for each row execute function public.set_updated_at();

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists trg_policies_updated_at on public.policies;
create trigger trg_policies_updated_at
before update on public.policies
for each row execute function public.set_updated_at();

drop trigger if exists trg_leads_updated_at on public.leads;
create trigger trg_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists trg_tasks_updated_at on public.tasks;
create trigger trg_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

create or replace function public.current_user_is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.agency_memberships membership
    where membership.profile_id = auth.uid()
      and membership.role = 'super_admin'
  );
$$;

create or replace function public.user_has_agency_access(target_agency_id uuid)
returns boolean
language sql
stable
as $$
  select
    public.current_user_is_super_admin()
    or exists (
      select 1
      from public.agency_memberships membership
      where membership.profile_id = auth.uid()
        and membership.agency_id = target_agency_id
    );
$$;

alter table public.agencies enable row level security;
alter table public.profiles enable row level security;
alter table public.agency_memberships enable row level security;
alter table public.customers enable row level security;
alter table public.policies enable row level security;
alter table public.leads enable row level security;
alter table public.tasks enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles
for select
using (id = auth.uid() or public.current_user_is_super_admin());

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles
for update
using (id = auth.uid() or public.current_user_is_super_admin());

drop policy if exists "agency_memberships_by_agency" on public.agency_memberships;
create policy "agency_memberships_by_agency"
on public.agency_memberships
for select
using (
  profile_id = auth.uid()
  or public.current_user_is_super_admin()
  or public.user_has_agency_access(agency_id)
);

drop policy if exists "agencies_access" on public.agencies;
create policy "agencies_access"
on public.agencies
for select
using (public.user_has_agency_access(id));

drop policy if exists "customers_by_agency" on public.customers;
create policy "customers_by_agency"
on public.customers
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));

drop policy if exists "policies_by_agency" on public.policies;
create policy "policies_by_agency"
on public.policies
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));

drop policy if exists "leads_by_agency" on public.leads;
create policy "leads_by_agency"
on public.leads
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));

drop policy if exists "tasks_by_agency" on public.tasks;
create policy "tasks_by_agency"
on public.tasks
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));

drop policy if exists "messages_by_agency" on public.messages;
create policy "messages_by_agency"
on public.messages
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));

drop policy if exists "documents_by_agency" on public.documents;
create policy "documents_by_agency"
on public.documents
for all
using (public.user_has_agency_access(agency_id))
with check (public.user_has_agency_access(agency_id));
