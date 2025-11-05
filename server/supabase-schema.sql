-- Enable required extension for UUIDs if needed
create extension if not exists pgcrypto;

create table if not exists seo_configs (
  id text primary key,
  title text,
  description text,
  canonical text,
  og_image text,
  robots text,
  keywords text[],
  json_ld jsonb,
  updated_at timestamptz default now(),
  updated_by text
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  product text,
  message text,
  source_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  status text default 'new',
  created_at timestamptz default now()
);

-- Settings table for site-wide configuration (e.g., GA4)
create table if not exists settings (
  key text primary key,
  value text,
  updated_at timestamptz default now()
);

-- Blog articles for Insights & Inspiration
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  cover_image text,
  content text not null,
  tags text[] default '{}',
  status text default 'draft', -- 'draft' | 'published'
  author text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
