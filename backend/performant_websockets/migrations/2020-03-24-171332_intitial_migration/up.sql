create table "user" (
  id             integer primary key,
  name           text      not null,
  username       text      not null,
  email          text      not null,
  password_hash  text      not null,
  created        timestamp not null,
  email_verified boolean
);

create table if not exists club (
  id                integer primary key,
  name              text,
  registered_school text,
  school_verified   boolean   not null,
  created           timestamp not null
);

create table training_session (
  id          integer primary key,
  start_time  timestamp,
  end_time    timestamp,
  livestream  boolean not null,
  description text,
  club_id     integer references "user" (id)
);

create table training_session_attendance (
  id                  integer primary key,
  training_session_id integer references training_session (id),
  user_id             integer references "user" (id),
  attending           boolean not null
);

create table chat_message_thread (
  id          integer primary key,
  last_active timestamp,
  user_count  integer not null,
  club_id     integer references club (id)
);

create table chat_message (
  id        integer primary key,
  thread_id integer   not null references chat_message_thread (id),
  is_reply  boolean   not null,
  reply_to  integer references chat_message (id),
  created   timestamp not null
)
