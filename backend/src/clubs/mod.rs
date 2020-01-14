use actix_web::post;
use diesel::prelude::*;
use diesel;
use crate::models::{ClubMemberships, Club};

fn get_club(&conn: SqliteConnection, user_id: i32) -> Result<ClubMemberships, diesel::result::Error> {
    use super::schema::clubmemberships;
    let membership = clubmemberships::table.find(clubmemberships::user.eq(user_id)).first::<ClubMemberships>(conn)?;
    Club::belonging_to(&membership)
}

#[post("/club/get")]
fn get_club_route() {}