-- Your SQL goes here
create table users(
  id integer primary key,
  name text not null,
  email text not null,
  email_verified text not null,
  password text
);

create table clubs(
  id integer primary key,
  name text not null,
  owner integer not null,
  foreign key(owner) references users(id)
);

create table clubmemberships(
  id integer primary key,
  user integer not null,
  club integer not null,
  foreign key(club) references clubs(id),
  foreign key(user) references users(id)
);
