use actix_web::{Error, HttpResponse, post, Responder, web};
use super::Pool;
use serde::{Deserialize, Serialize};

use super::{get_user, User, create_user, get_user_by_email};
use bcrypt::hash;
use crate::auth::issue_jwt;

#[derive(Serialize)]
struct JWT {
    token: String
}

#[derive(Deserialize)]
struct Login {
    email: String,
    password: String,
}

#[derive(Deserialize)]
struct Register {
    name: String,
    email: String,
    username: String,
    password: String,
}

#[derive(Serialize)]
struct RegisterResult {
    success: bool,
    message: String,
}

#[derive(Serialize)]
struct LoginResult {
    success: bool,
    token: String,
    message: String,
}


#[post("/auth/register")]
pub fn register(user: web::Json<Register>, pool: web::Data<Pool>) -> impl Responder {
    let db_user = get_user_by_email(&pool, String::from(&user.email));
    return match db_user {
        Ok(t) => {
            return web::Json(RegisterResult {
                success: false,
                message: String::from("That user already exists!"),
            });
        }
        Err(e) => {
            return match hash(user.password.to_string(), 5) {
                Ok(hash) => {
                    let user = create_user(&*pool.get().unwrap(), &user.name, &user.email, &hash);
                    return web::Json(RegisterResult {
                        success: true,
                        message: String::from(format!("Successfully created that user with the id: {}", user)),
                    });
                }
                Err(e) => {
                    return web::Json(RegisterResult {
                        success: false,
                        message: String::from("There was a server error when trying to create this account."),
                    });
                }
            };
        }
    };
}

#[post("/auth/login")]
pub fn login(user: web::Json<Login>, pool: web::Data<Pool>) -> impl Responder {
    match issue_jwt(&pool, &user.email, &user.password) {
        Ok(token) => web::Json(LoginResult {
            success: true,
            token,
            message: String::from("Successfully generated token!"),
        }),
        Err(e) => web::Json(LoginResult {
            success: false,
            token: String::from(""),
            message: String::from("Error logging you in. Are you sure your details are correct?"),
        })
    }
}