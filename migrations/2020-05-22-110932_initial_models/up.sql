-- Your SQL goes here

create table if not exists "user" (
    id serial primary key,
    name text not null,
    email text not null,
    password_hash text not null,
    created timestamp not null default now(),
    email_verified boolean not null,
    pgp text
);

create table if not exists club (
    id serial primary key,
    name text not null,
    registered_school text not null,
    school_verified boolean not null,
    created boolean not null,
    join_code text not null
);

create table if not exists training_session (
    id serial primary key,
    start_time timestamp not null,
    end_time timestamp not null,
    livestream boolean not null,
    description text not null,
    club_id integer not null references club (id)
);

create table if not exists training_session_attendance (
    id serial primary key,
    training_session_id integer not null references training_session (id),
    user_id integer not null references "user" (id),
    attending boolean not null default 'f'
);

create table if not exists chat_message_thread (
    id serial primary key,
    last_active timestamp not null default now(),
    club_id integer not null references club (id),
    title text not null
);

create table if not exists chat_message (
    id serial primary key,
    thread_id integer not null references chat_message_thread (id),
    chat_message_id integer references chat_message (id),
    created timestamp not null default now(),
    content text not null,
    user_id integer not null references "user" (id)
);