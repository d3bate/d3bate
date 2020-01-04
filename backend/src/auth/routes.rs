use actix_web::{Error, HttpResponse, post, Responder, web};
use super::Pool;
use serde::{Deserialize, Serialize};

use super::{get_user, User, create_user, get_user_by_email};
use bcrypt::hash;

#[derive(Serialize)]
struct JWT {
    token: String
}

#[derive(Deserialize)]
struct Login {
    username: String,
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
struct AuthResult {
    success: bool,
    message: String,
}


#[post("/auth/register")]
fn register(user: web::Json<Register>, pool: web::Data<Pool>) -> impl Responder {
    let db_user = get_user_by_email(&pool, String::from(&user.email));
    return match db_user {
        Ok(T) => {
            return web::Json(AuthResult {
                success: false,
                message: String::from("That user already exists!"),
            });
        }
        Err(E) => {
            return match hash(user.password.to_string(), 5) {
                Ok(hash) => {
                    let user = create_user(&*pool.get().unwrap(), &user.name, &user.email, &hash);
                    return web::Json(AuthResult {
                        success: true,
                        message: String::from(format!("Successfully created that user with the id: {}", user)),
                    });
                }
                Err(E) => {
                    return web::Json(AuthResult {
                        success: false,
                        message: String::from("There was a server error when trying to create this account."),
                    });
                }
            };
        }
    };
}

#[post("auth/login")]
fn login(user: web::Json<Login>, pool: web::Data<Pool>) -> impl Responder {
    web::Json(AuthResult {
        success: false,
        message: String::from("This route is not yet implemented."),
    })
}