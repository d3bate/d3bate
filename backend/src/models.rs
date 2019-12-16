use diesel::{self, prelude::*};

use self::schema::users;
use self::schema::users::dsl::users as all_users;

#[derive(Queryable)]
#[table_name = "users"]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
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

#[table_name = "clubs"]
#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
pub struct Club {
    pub id: i32,
    pub name: String,
    pub owner: i32,
}

#[table_name = "clubmemberships"]
#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
pub struct ClubMemberships {
    pub id: i32,
    pub user: i32,
    pub club: i32,
}

