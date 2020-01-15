use actix_web::{web, post, Responder};
use super::Pool;
use diesel::prelude::*;
use diesel;
use crate::models::{ClubMemberships, Club};
use serde::{Serialize, Deserialize};
use super::auth::{AuthenticatedRequest, verify_jwt};
use crate::helpers::RequestError;

impl std::convert::From<auth::AuthError> for web::Json<helpers::RequestError> {}

#[derive(Serialize, Deserialize)]
struct GetClub {
    id: i32,
    name: String,
}

fn get_club(conn: &SqliteConnection, user_id: i32) -> Result<Club, diesel::result::Error> {
    use super::schema::clubmemberships;
    let membership = clubmemberships::table.filter(clubmemberships::user.eq(user_id)).first::<ClubMemberships>(conn)?;
    Ok(Club::belonging_to(&membership): Club)
}

#[post("/club/get")]
fn get_club_route(auth: web::Json<AuthenticatedRequest>, pool: web::data::Pool) -> impl Responder {
    let conn = &pool.get().unwrap();
    let user_id = verify_jwt(&pool, &auth.token)?;
    let club_result = get_club(conn, user_id);
    match club_result {
        Ok(club) => {
            Ok(web::Json(GetClub {
                id: club.id?,
                name: club.name,
            }))
        }
        Err(error) => {
            Err(web::Json(RequestError {
                error_message: String::from("Could not find that club. Are you sure that you are signed in?"),
                error_code: 520,
            }))
        }
    }
}