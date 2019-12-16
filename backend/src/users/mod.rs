#![allow(proc_macro_derive_resolution_fallback)]

use super::schema::users;

pub mod handler;
pub mod query_functions;

#[derive(Queryable, Serializable)]
#[table_name = "users"]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
}
