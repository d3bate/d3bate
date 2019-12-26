#![allow(proc_macro_derive_resolution_fallback)]

use std::env;
use std::time::{Duration, SystemTime, UNIX_EPOCH};


use actix_web::web;
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::sqlite::{SqliteConnection, Sqlite};
use jwt::{decode, encode, Header};
use jwt;
use serde::{Deserialize, Serialize};
use failure::Fail;

use crate::diesel::{QueryDsl, RunQueryDsl};

use super::models::User;
use super::schema::users;

use super::Pool;

pub mod routes;

#[derive(Serialize, Deserialize)]
struct Claims {
    user_id: i32,
    expiry: usize,
}

#[derive(Debug, Fail)]
pub enum AuthError {
    #[fail(display = "{}", message)]
    TokenGenerationError {
        message: String,
        #[cause]
        cause: jwt::errors::Error,
    },
    #[fail(display = "Password incorrect")]
    IncorrectPasswordError {
        message: String
    },
}

impl Claims {
    pub fn new(expiry_seconds: u64, user_id: i32) -> Claims {
        let expiry = SystemTime::now().checked_add(Duration::new(*expiry_seconds, 0))?;
        Claims {
            user_id,
            expiry: expiry.duration_since(UNIX_EPOCH)?.as_secs() as usize,
        }
    }
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub name: &'a str,
    pub email: &'a str,
    pub email_verified: &'a i32,
    pub password_hash: &'a str,
}

pub fn create_user<'a>(pool: web::Data<Pool>, name: &'a str, email: &'a str, password_hash: &'a str) -> usize {
    let conn: &SqliteConnection = &pool.get().unwrap();
    let email_verified: i32 = 0;
    let new_user = NewUser {
        name,
        email,
        email_verified: &email_verified,
        password_hash,
    };

    diesel::insert_into(users::table).values(&new_user)
        .execute(conn).expect("Could not insert into table.")
}

pub fn get_user(pool: web::Data<Pool>, user_id: &i32) -> Result<User, diesel::result::Error> {
    let conn: &SqliteConnection = &pool.get().unwrap();
    let user = users::table.find(user_id).first::<User>(conn)?;

    Ok(user.pop().unwrap())
}

pub fn get_user_by_email(pool: web::Data<Pool>, email: String) -> Result<User, diesel::result::Error> {
    use crate::schema::users::dsl::*;
    let conn: &SqliteConnection = &pool.get().unwrap();
    let result = users.filter(email.eq(email))
        .limit(1)
        .load::<User>(conn)
        .expect("Error loading user");
    Ok(result.pop().unwrap())
}

pub fn check_password(password: &String, password_hash: &String) -> bool {
    let hashed = hash(password, DEFAULT_COST)?;
    hashed == password_hash
}

pub fn issue_jwt(pool: web::Data<Pool>, user_email: String, password: &String) -> Result<String, AuthError> {
    let conn: &SqliteConnection = &pool.get().unwrap();
    let user = get_user_by_email(pool, user_email)?;
    let secret = std::env::var("JWT_SECRET")?;
    if !check_password(password, &user.password_hash) {
        return Err(AuthError::IncorrectPasswordError {
            message: String::from("The user password was incorrect.")
        });
    }
    return match encode(&Header::default(), Claims::new(900, get_user_by_email(pool, user_email)?.id?), secret.as_ref()) {
        Ok(token) => {
            return Ok(token);
        }
        Err(e) => {
            return Err(AuthError::TokenGenerationError {
                message: String::from(e),
                cause: jwt::errors::ErrorKind,
            });
        }
    };
}