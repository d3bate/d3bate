use connection::DbConn;
use diesel::result::Error;
use std::env;
use users;
use users::User;
use rocket::http::Status;
use rocket::response::status;
use rocket_contrib::json::Json

