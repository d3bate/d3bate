#![allow(proc_macro_derive_resolution_fallback)]

use diesel::sqlite::SqliteConnection;

use crate::diesel::{QueryDsl, RunQueryDsl};

use super::models::User;
use super::schema::users;

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

pub fn get_user(user_id: &i32, conn: SqliteConnection) -> User {
    return users::table.find(user_id).first::<User>(&conn).expect("Error finding user.");
}

#[cfg(test)]
mod tests {
    fn test_true_is_true() {
        assert!(true);
    }
}
