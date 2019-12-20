use actix_web::{Error, HttpResponse, post, Responder, web};
use super::Pool;
use serde::{Deserialize, Serialize};

use super::{get_user, User};

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

#[post("/auth/register")]
fn register(user: web::Json<Register>, pool: web::Data<Pool>) -> String {
    String::from("")
}

#[post("auth/login")]
fn login(user: web::Json<Login>, pool: web::Data<Pool>) -> String {}