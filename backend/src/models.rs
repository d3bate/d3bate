#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub email_verified: i32,
    pub password_hash: String,
}
