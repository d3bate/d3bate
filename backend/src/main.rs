#![feature(proc_macro)]
extern crate actix_web;
#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate jsonwebtoken as jwt;
#[macro_use]
extern crate jsonwebtoken;
extern crate serde;

use std::env;
use std::io::{Read, stdin};
use std::time::Duration

use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;

use models::User;
use schema::users;

mod schema;
mod models;
mod auth;


pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connection to {}", database_url))
}

const CLIENT_TIMEOUT: Duration = Duration::from_secs(60);


fn main() {
    use schema::users::dsl::*;
    let connection = establish_connection();
}
