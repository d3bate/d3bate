#![allow(proc_macro_derive_resolution_fallback)]

use diesel;
use diesel::prelude::*;

use super::User;

pub fn all(conn: &SqliteConnection) -> QueryResult<Vec<User>> {
    users::table.load::<User>(&*conn)
}

pub fn get(id: i32, conn: &SqliteConnection) -> QueryResult<User> {
    users::table.find(id).get_result::<User>(conn)
}

pub fn insert(user: User, conn: &SqliteConnection) -> QueryResult<Person> {
    diesel::insert_into(users::table)
        .values(&InsertableUser::from_user(user))
        .get_result(conn)
}

pub fn update(id: i32, user: User, connection: &SqliteConnection) -> QueryResult<User> {
    diesel::update(users::table.find(id))
        .set(&user)
        .get_result(conn)
}

pub fn delete(id: i32, conn: &SqliteConnection) -> QueryResult<usize> {
    diesel::delete(users::table.find(id))
        .execute(conn)
}

#[derive(Insertable)]
#[table_name = "users"]
pub struct InsertableUser {
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
}

impl InsertableUser {
    pub fn from_user(user: User) -> InsertableUser {
        InsertableUser {
            name: user.name,
            email: user.email,
            email_verified: user.email_verified,
            password_hash: user.password_hash,
        }
    }
}
