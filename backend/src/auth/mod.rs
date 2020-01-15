#![allow(proc_macro_derive_resolution_fallback)]

use std::env;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use actix_web::web;
use bcrypt::{DEFAULT_COST, hash, verify};
use diesel::sqlite::{SqliteConnection, Sqlite};
use jwt::{decode, encode, Header, Algorithm, Validation};
use jwt;
use serde::{Deserialize, Serialize};
use failure::Fail;
use diesel::prelude::*;

use crate::diesel::{QueryDsl, RunQueryDsl};

use super::models::*;
use super::schema::users;

use super::Pool;
use crate::helpers::RequestError;

pub mod routes;


#[derive(Serialize, Deserialize)]
pub struct Claims {
    user_id: i32,
    expiry: usize,
}

#[derive(Serialize, Deserialize)]
pub struct AuthenticatedRequest {
    pub token: String
}

#[derive(Debug, Fail, Serialize)]
pub enum AuthError {
    #[fail(display = "{}", message)]
    TokenGenerationError {
        message: String
    },
    #[fail(display = "Password incorrect")]
    IncorrectPasswordError {
        message: String
    },
    #[fail(display = "Not found")]
    NotFoundError {
        message: String
    },
    #[fail(display = "Database error")]
    DatabaseError {
        message: String
    },
    #[fail(display = "Environment variables not set")]
    EnvironmentVariableError {
        message: String
    },
    #[fail(display = "Time error")]
    TimeError {
        message: String
    },
}

impl std::convert::From<AuthError> for RequestError {
    fn from(error: AuthError) -> Self {
        actix_web::error::ErrorInternalServerError("Authentication error.").as_response_error()
    }
}

impl std::convert::From<std::option::NoneError> for AuthError {
    fn from(error: std::option::NoneError) -> Self {
        AuthError::NotFoundError {
            message: String::from("Error: not found.")
        }
    }
}

impl std::convert::From<diesel::result::Error> for AuthError {
    fn from(error: diesel::result::Error) -> Self {
        AuthError::DatabaseError {
            message: String::from("Database error.")
        }
    }
}

impl std::convert::From<std::env::VarError> for AuthError {
    fn from(error: std::env::VarError) -> Self {
        AuthError::EnvironmentVariableError {
            message: String::from("Are you sure that all the necessary environment variables are set?")
        }
    }
}

impl std::convert::From<std::time::SystemTimeError> for AuthError {
    fn from(error: std::time::SystemTimeError) -> Self {
        AuthError::TimeError {
            message: String::from("Time error.")
        }
    }
}

impl std::convert::From<jwt::errors::Error> for AuthError {
    fn from(error: jwt::errors::Error) -> Self {
        AuthError::TokenGenerationError {
            message: String::from("Token generation error.")
        }
    }
}

impl Claims {
    pub fn new(expiry_seconds: u64, user_id: i32) -> Result<Claims, AuthError> {
        let expiry = SystemTime::now().checked_add(Duration::new(expiry_seconds, 0))?;
        Ok(Claims {
            user_id,
            expiry: expiry.duration_since(UNIX_EPOCH)?.as_secs() as usize,
        })
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

pub fn create_user<'a>(conn: &SqliteConnection, name: &'a str, email: &'a str, password_hash: &'a str) -> usize {
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

pub fn get_user(pool: &web::Data<Pool>, user_id: &i32) -> Result<User, diesel::result::Error> {
    let conn: &SqliteConnection = &*pool.get().unwrap();
    let user: User = users::table.find(user_id).first::<User>(conn)?;
    Ok(user)
}


/// Returns the user struct (or a diesel error) corresponding to a user in the database
pub fn get_user_by_email(pool: &web::Data<Pool>, email: String) -> Result<User, diesel::result::Error> {
    use super::schema::users::dsl::*;
    let conn: &SqliteConnection = &*pool.get().unwrap();
    let mut result = users.filter(email.eq(email))
        .limit(1)
        .load::<User>(conn)
        .expect("Error loading user");
    Ok(result.pop().unwrap())
}

/// Validates a user's password.
pub fn check_password(password: &String, password_hash: &String) -> bool {
    match hash(password, DEFAULT_COST) {
        Ok(hashed) => {
            &hashed == password_hash
        }
        Err(e) => {
            false
        }
    }
}


/// Verifies the integrity of a JSON web token
pub fn verify_jwt(pool: &web::Data<Pool>, token: &str) -> Result<i32, AuthError> {
    let secret = std::env::var("JWT_SECRET")?;
    let token_message: Claims = decode::<Claims>(token, secret.as_ref(), &Validation::new(Algorithm::HS256))?.claims;
    let expiry_time = UNIX_EPOCH + std::time::Duration::from_secs(token_message.expiry as u64);
    match expiry_time > std::time::SystemTime::now() {
        true => {
            Ok(token_message.user_id)
        }
        false => {
            Err(AuthError::TimeError {
                message: String::from("Token has expired.")
            })
        }
    }
}


/// Issues a new JSON web token. The expiry time is 900 seconds after issuance.
pub fn issue_jwt(pool: &web::Data<Pool>, user_email: &str, password: &str) -> Result<String, AuthError> {
    let conn: &SqliteConnection = &*pool.get().unwrap();
    let user = get_user_by_email(pool, String::from(user_email))?;
    let secret = std::env::var("JWT_SECRET")?;
    if !check_password(&String::from(password), &user.password_hash) {
        return Err(AuthError::IncorrectPasswordError {
            message: String::from("The user password was incorrect.")
        });
    }
    return match encode(&Header::default(), &Claims::new(900, get_user_by_email(pool, String::from(user_email))?.id?), secret.as_ref()) {
        Ok(token) => {
            return Ok(token);
        }
        Err(e) => {
            return Err(AuthError::TokenGenerationError {
                message: String::from("Could not generate a JSON Web Token."),
            });
        }
    };
}