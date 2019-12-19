use actix_web::{HttpResponse, Responder, web};
use serde::Serialize;

use super::{get_user, issue_jwt, User};

#[derive(Serialize)]
struct JWT {
    token: String
}

