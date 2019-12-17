#[macro_use]
extern crate serde_json;

use std::env;
use std::time::{Duration, SystemTime};

use frank_jwt::{Algorithm, decode, encode};

use super::query_functions;
use super::User;

pub fn issue_jwt(user: &User) -> String {
    let expiry = SystemTime::now().checked_add(Duration::new(900 as u64, 0));
    let mut payload;
    match expiry {
        Ok(time) => {
            payload = json!({
                "id": user.id,
                "exp": time
            })
        }
        Err(E) => {
            panic!(format!("Some error {} occurred.", E))
        }
    }
    let mut header = json!({});
    let secret = env::var("JWT_SECRET_KEY").unwrap();
    let signing_key = env::var("JWT_SIGNING_TOKEN").unwrap();
    let jwt = encode(&header, &signing_key, &payload, Algorithm::RS256);
    match jwt {
        Ok(String) => {
            return jwt;
        }
        Err(E) => {
            panic!(format!("Some error {} occurred.", E))
        }
    }
}
