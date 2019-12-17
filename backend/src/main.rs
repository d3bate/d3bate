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

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub name: &'a str,
    pub email: &'a str,
    pub email_verified: &'a i32,
    pub password_hash: &'a str,
}

pub fn establish_connection() -> SqliteConnection {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    SqliteConnection::establish(&database_url)
        .expect(&format!("Error connection to {}", database_url))
}

pub fn create_user<'a>(conn: SqliteConnection, name: &'a str, email: &'a str, password_hash: &'a str) -> usize {
    use schema::users;
    let email_verified: i32 = 0;
    let new_user = NewUser {
        name,
        email,
        email_verified: &email_verified,
        password_hash,
    };

    diesel::insert_into(users::table).values(&new_user).execute(&conn).expect("Could not insert into table.")
}

fn main() {
    use schema::users::dsl::*;
    let connection = establish_connection();

    println!("Username: ");
    let mut username = String::new();
    stdin().read_line(&mut username).unwrap();
    let username = &username[..(username.len() - 1)];
    let mut mail = String::new();
    stdin().read_line(&mut mail).unwrap();
    let mail = &mail[..(username.len() - 1)];
    let user = create_user(connection, username, mail, &String::from("not a hash"));
    println!("Saved user {} with id {}", username, user)
}
