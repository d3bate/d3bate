-- Your SQL goes here
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created INTEGER NOT NULL, -- A unix timestamp (in seconds since 1st January 1970).
)
