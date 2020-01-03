#![feature(proc_macro)]
extern crate bcrypt;
extern crate actix_web;
#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate jsonwebtoken as jwt;
#[macro_use]
extern crate jsonwebtoken;
extern crate serde;
extern crate failure;

use std::env;
use std::io::{Read, stdin};
use std::time::Duration;

use actix_web::HttpServer;
use diesel::prelude::*;
use diesel::r2d2::ConnectionManager;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;

use models::User;
use schema::users;

type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

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
    dotenv::dotenv().ok();
    let connspec = std::env::var("DATABASE_URL").expect("You must set the `DATABASE_URL` environment variable.");
    let manager = ConnectionManager::<SqliteConnection>::new(connspec);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database pool");
}
