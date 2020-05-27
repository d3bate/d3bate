-- Your SQL goes here
create table if not exists "user" (
  id serial primary key,
  name text not null check (length(name) < 256),
  email text not null check (length(name) < 256),
  password_hash text not null check (length(password_hash) < 2048),
  created timestamp not null default now(),
  email_verified boolean not null,
  pgp text check (length(pgp) < 256),
  unique(email),
  unique(password_hash)
);
create table if not exists club (
  id serial primary key,
  name text not null,
  registered_school text not null check (length (registered_school) < 256),
  school_verified boolean not null,
  created timestamp not null default now(),
  join_code text not null check (length (join_code) < 256),
  unique(name),
  unique(registered_school),
  unique(join_code)
);
create table if not exists club_member (
  id serial primary key,
  user_id integer not null references "user" (id),
  club_id integer not null references club (id),
  role integer not null check (
    role > 0
    and role <= 3
  )
);
create table if not exists training_session (
  id serial primary key,
  start_time timestamp not null,
  end_time timestamp not null,
  livestream boolean not null,
  description text not null check (length(description) < 256),
  club_id integer not null references club (id) on delete cascade
);
create table if not exists training_session_attendance (
  id serial primary key,
  training_session_id integer not null references training_session (id) on delete cascade,
  user_id integer not null references "user" (id) on delete cascade,
  attending boolean not null default 'f'
);
create table if not exists chat_message_thread (
  id serial primary key,
  last_active timestamp not null default now(),
  club_id integer not null references club (id) on delete cascade,
  title text not null check (length(title) < 256),
  unique(title)
);
create table if not exists chat_message (
  id serial primary key,
  thread_id integer not null references chat_message_thread (id) on delete cascade,
  chat_message_id integer references chat_message (id),
  created timestamp not null default now(),
  content text not null check (length(content) < 4096),
  user_id integer not null references "user" (id)
);