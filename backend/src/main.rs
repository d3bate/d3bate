#![feature(try_trait)]
extern crate bcrypt;
extern crate actix_web;
#[macro_use]
extern crate diesel;

use r2d2_diesel::ConnectionManager;

extern crate dotenv;
extern crate jsonwebtoken as jwt;
#[macro_use]
extern crate jsonwebtoken;
extern crate serde;
extern crate failure;

use std::env;
use std::io::{Read, stdin};
use std::time::Duration;

use actix_web::{HttpServer, App};
use diesel::prelude::*;
use diesel::sqlite::SqliteConnection;
use dotenv::dotenv;

use models::User;
use schema::users;

type Pool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

mod schema;
mod models;
mod helpers;
mod auth;
mod clubs;


pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connection to {}", database_url))
}

const CLIENT_TIMEOUT: Duration = Duration::from_secs(60);

fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let connspec = std::env::var("DATABASE_URL").expect("You must set the `DATABASE_URL` environment variable.");
    let manager = ConnectionManager::<SqliteConnection>::new(connspec);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database pool");
    HttpServer::new(|| {
        App::new()
            .service(auth::routes::register)
            .service(auth::routes::login)
    })
        .bind("127.0.0.1:8080")?.run()
}
