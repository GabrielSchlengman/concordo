-- Execute uma vez no SQL Editor do Supabase.
-- O navegador nunca acessa esta tabela diretamente; somente o servidor do Alpendre usa a service role.

create table if not exists public.alpendre_state (
  scope text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint alpendre_state_scope check (scope = 'main')
);

alter table public.alpendre_state enable row level security;
revoke all on table public.alpendre_state from anon, authenticated;
grant all on table public.alpendre_state to service_role;

comment on table public.alpendre_state is
  'Estado persistente do MVP Alpendre. Acesso exclusivo do servidor usando SUPABASE_SERVICE_ROLE_KEY.';

insert into storage.buckets (id, name, public, file_size_limit)
values ('alpendre-files', 'alpendre-files', false, 8388608)
on conflict (id) do update set public = false, file_size_limit = 8388608;

-- Nenhum visitante acessa o bucket diretamente: downloads passam pelo servidor do Alpendre.
