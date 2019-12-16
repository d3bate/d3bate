pub mod schema;
pub mod models;

extern crate diesel;
extern crate dotenv;

use std::env;

use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenv::dotenv;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("You must set the environment variable DATABASE_URL");
    PgConnection::establish(&database_url)
        .expect(&format!("Error connectiong to {}", database_url))
}
