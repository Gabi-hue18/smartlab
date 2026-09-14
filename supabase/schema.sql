-- SmartLab production schema for Supabase
create extension if not exists pgcrypto;

create type public.user_role as enum ('admin','staff','technician');
create type public.equipment_status as enum ('available','in_use','maintenance','damaged','retired');
create type public.task_status as enum ('scheduled','assigned','in_progress','completed','cancelled');
create type public.priority_level as enum ('low','medium','high','critical');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role public.user_role not null default 'staff',
  department text,
  created_at timestamptz default now()
);

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  asset_id text unique not null,
  name text not null,
  category text,
  manufacturer text,
  model text,
  serial_number text,
  purchase_date date,
  warranty_expiry date,
  location text,
  status public.equipment_status not null default 'available',
  condition text default 'good',
  next_maintenance date,
  next_calibration date,
  operating_hours numeric default 0,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.faults (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.equipment(id) on delete cascade,
  asset_id text,
  equipment_name text,
  description text not null,
  priority public.priority_level default 'medium',
  status text default 'reported',
  reported_by text,
  assigned_to text,
  reported_at timestamptz default now(),
  resolved_at timestamptz
);

create table public.maintenance_tasks (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.equipment(id) on delete cascade,
  asset_id text,
  equipment_name text,
  type text default 'preventive',
  title text not null,
  priority public.priority_level default 'medium',
  status public.task_status default 'scheduled',
  assigned_to text,
  due_date date,
  diagnosis text,
  repair_performed text,
  cost numeric default 0,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create table public.maintenance_history (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.equipment(id) on delete cascade,
  date date default current_date,
  action text not null,
  technician text,
  cost numeric default 0,
  result text,
  notes text,
  created_at timestamptz default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid references public.equipment(id) on delete cascade,
  name text not null,
  category text,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  type text default 'info',
  title text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor uuid references public.profiles(id),
  action text not null,
  entity_type text,
  entity_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id, full_name, role)
  values(new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), coalesce((new.raw_user_meta_data->>'role')::public.user_role,'staff'));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_role() returns public.user_role language sql stable security definer set search_path=public as $$
  select role from public.profiles where id=auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.equipment enable row level security;
alter table public.faults enable row level security;
alter table public.maintenance_tasks enable row level security;
alter table public.maintenance_history enable row level security;
alter table public.documents enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles own or admin" on public.profiles for select using (id=auth.uid() or public.current_role()='admin');
create policy "admin manages profiles" on public.profiles for all using (public.current_role()='admin') with check (public.current_role()='admin');

create policy "authenticated read equipment" on public.equipment for select to authenticated using (true);
create policy "admin staff insert equipment" on public.equipment for insert to authenticated with check (public.current_role() in ('admin','staff'));
create policy "admin staff update equipment" on public.equipment for update to authenticated using (public.current_role() in ('admin','staff')) with check (public.current_role() in ('admin','staff'));
create policy "admin delete equipment" on public.equipment for delete to authenticated using (public.current_role()='admin');

create policy "authenticated read faults" on public.faults for select to authenticated using (true);
create policy "authenticated create faults" on public.faults for insert to authenticated with check (true);
create policy "admin tech update faults" on public.faults for update to authenticated using (public.current_role() in ('admin','technician'));

create policy "authenticated read maintenance" on public.maintenance_tasks for select to authenticated using (true);
create policy "admin staff create maintenance" on public.maintenance_tasks for insert to authenticated with check (public.current_role() in ('admin','staff'));
create policy "admin tech update maintenance" on public.maintenance_tasks for update to authenticated using (public.current_role() in ('admin','technician'));

create policy "authenticated read history" on public.maintenance_history for select to authenticated using (true);
create policy "admin tech create history" on public.maintenance_history for insert to authenticated with check (public.current_role() in ('admin','technician'));

create policy "authenticated read docs" on public.documents for select to authenticated using (true);
create policy "authenticated create docs" on public.documents for insert to authenticated with check (true);
create policy "admin delete docs" on public.documents for delete to authenticated using (public.current_role()='admin');

create policy "own notifications" on public.notifications for select to authenticated using (user_id=auth.uid() or user_id is null);
create policy "own notification updates" on public.notifications for update to authenticated using (user_id=auth.uid() or user_id is null);
create policy "admin create notifications" on public.notifications for insert to authenticated with check (public.current_role()='admin');

create policy "admin audit read" on public.audit_logs for select to authenticated using (public.current_role()='admin');
create policy "authenticated audit insert" on public.audit_logs for insert to authenticated with check (true);

insert into storage.buckets(id,name,public) values('equipment-docs','equipment-docs',false) on conflict (id) do nothing;
create policy "authenticated upload equipment docs" on storage.objects for insert to authenticated with check (bucket_id='equipment-docs');
create policy "authenticated read equipment docs" on storage.objects for select to authenticated using (bucket_id='equipment-docs');
create policy "admin delete equipment docs" on storage.objects for delete to authenticated using (bucket_id='equipment-docs' and public.current_role()='admin');
