-- Crystal Valley Auto Detail (Supabase)
-- One-time SQL setup for BOTH:
-- 1) Booking requests (POST /api/booking)
-- 2) Discount leads (POST /api/discounts)
--
-- Copy/paste into Supabase SQL Editor and run.

-- UUID generation helper
create extension if not exists "pgcrypto";

-- =========================
-- 1) Booking requests table
-- =========================

create table if not exists public.booking_appointments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  service text not null,
  car_type text not null,
  full_name text not null,
  phone text not null,
  address text not null,
  requested_datetime timestamptz not null,

  -- Optional user notes
  remarks text,

  -- Helpful metadata
  source_page text,
  user_agent text,
  ip inet,

  -- Email delivery debug info
  formspree_status integer,
  formspree_response jsonb,

  -- Internal workflow state
  status text not null default 'new'
);

-- Prevent duplicate inserts on retries (the API uses UPSERT with this conflict target)
-- (Phone + datetime + service + car_type uniquely identifies a booking request)
alter table public.booking_appointments
  drop constraint if exists booking_appointments_unique_request;

alter table public.booking_appointments
  add constraint booking_appointments_unique_request
  unique (phone, requested_datetime, service, car_type);

create index if not exists booking_appointments_created_at_idx
  on public.booking_appointments (created_at desc);

create index if not exists booking_appointments_requested_datetime_idx
  on public.booking_appointments (requested_datetime);

create index if not exists booking_appointments_phone_idx
  on public.booking_appointments (phone);

-- RLS: API uses SUPABASE_SERVICE_ROLE_KEY server-side, which bypasses RLS.
-- Keep RLS enabled so there is no accidental public access.
alter table public.booking_appointments enable row level security;

-- No public policies created intentionally.

-- ======================
-- 2) Discount leads table
-- ======================

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  name text not null,
  phone text not null,
  car_model text not null,
  discount integer not null
);

create index if not exists discounts_created_at_idx
  on public.discounts (created_at desc);

create index if not exists discounts_phone_idx
  on public.discounts (phone);

create index if not exists discounts_name_idx
  on public.discounts (name);

-- RLS: /api/discounts uses SUPABASE_SERVICE_ROLE_KEY server-side.
alter table public.discounts enable row level security;

-- No public policies created intentionally.
