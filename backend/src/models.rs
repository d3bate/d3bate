use diesel::{self, prelude::*};
use self::schema::users;
use self::schema::users::dsl::{users as all_users};

#[table_name = "users"]
#[derive(Serialize, Queryable, Insertable, Debug, Clone)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
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

