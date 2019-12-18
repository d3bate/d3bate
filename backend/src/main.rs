#![feature(proc_macro)]

#[macro_use]
extern crate diesel;
extern crate dotenv;

use std::env;
use std::io::{Read, stdin};

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


fn main() {
    use schema::users::dsl::*;
    let connection = establish_connection();

    println!("{}", auth::get_user(&1, connection).id)
}
