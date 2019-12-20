#![allow(proc_macro_derive_resolution_fallback)]

use std::env;
use std::time::{Duration, SystemTime, UNIX_EPOCH};


use actix_web::{web, Error};
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::sqlite::{SqliteConnection, Sqlite};
use jwt::{decode, encode, Header};
use serde::{Deserialize, Serialize};

use crate::diesel::{QueryDsl, RunQueryDsl};

use super::models::User;
use super::schema::users;

use super::Pool;

pub mod routes;

#[derive(Serialize, Deserialize)]
struct Claims {
    user_id: i32,
    exp: usize,
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct NewUser<'a> {
    pub name: &'a str,
    pub email: &'a str,
    pub email_verified: &'a i32,
    pub password_hash: &'a str,
}

pub fn create_user<'a>(conn: SqliteConnection, name: &'a str, email: &'a str, password_hash: &'a str) -> usize {
    let email_verified: i32 = 0;
    let new_user = NewUser {
        name,
        email,
        email_verified: &email_verified,
        password_hash,
    };

    diesel::insert_into(users::table).values(&new_user)
        .execute(&conn).expect("Could not insert into table.")
}

pub fn get_user(user_id: &i32, pool: web::Data<Pool>) -> User {
    let conn: &SqliteConnection = &pool.get().unwrap();
    return users::table.find(user_id).first::<User>(conn).expect("Error finding user.");
}

pub fn issue_jwt(user_id: &i32, password: String, pool: web::Data<Pool>) -> Result<String, Error> {
    let user = get_user(user_id, pool);
    let expiry_time = SystemTime::now()
        .checked_add(Duration::new(900, 0))
        .expect("Error adding time.")
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards.");
    return match user.id {
        Some(uid) => {
            let hashed = match hash(password, DEFAULT_COST) {
                Ok(t) => t,
                Err(E) => String::from("")
            };
            if hashed != password {
                return Error("Incorrect password.");
            }
            let token = encode(&Header::default(), &Claims {
                user_id: uid,
                exp: expiry_time.as_secs() as usize,
            }, "".as_ref());
            return match token {
                Ok(t) => Ok(t),
                Err(e) => Err(e)
            };
        }
        None => Err(std::error::Error)
    };
}

#[cfg(test)]
mod tests {
    fn test_true_is_true() {
        assert!(true);
    }
}
