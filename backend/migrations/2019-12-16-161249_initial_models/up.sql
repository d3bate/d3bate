-- Your SQL goes here
create table if not exists users(
  id integer primary key,
  name text not null,
  email text not null,
  email_verified integer not null,
  password_hash text not null
);

create table if not exists clubs(
  id integer primary key,
  name text not null,
  owner integer not null,
  foreign key(owner) references users(id)
);

create table if not exists clubmemberships(
  id integer primary key,
  user integer not null,
  club integer not null,
  foreign key(club) references clubs(id),
  foreign key(user) references users(id)
);
