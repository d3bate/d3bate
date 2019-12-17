use diesel::{self, prelude::*};

#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
}


/*impl InsertableUser {
    pub fn from_user(user: User) -> InsertableUser {
        InsertableUser {
            name: user.name,
            email: user.email,
            email_verified: user.email_verified,
            password_hash: user.password_hash,
        }
    }
}*/

#[derive(Queryable)]
pub struct Club {
    pub id: i32,
    pub name: String,
    pub owner: i32,
}

#[derive(Queryable)]
pub struct ClubMemberships {
    pub id: i32,
    pub user: i32,
    pub club: i32,
}

