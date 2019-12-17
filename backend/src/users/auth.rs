use std::env;
use std::time::{Duration, SystemTime};

use frank_jwt::{Algorithm, decode, encode};

use super::query_functions;
use super::User;

pub fn issue_jwt(user: &User) -> Result<String, frank_jwt::Error> {
    let expiry = SystemTime::now().checked_add(Duration::new(900 as u64, 0));
    let mut payload = json!({
                "id": user.id,
                "exp": expiry
            });
    let mut header = json!({});
    let secret = env::var("JWT_SECRET_KEY").unwrap();
    let signing_key = env::var("JWT_SIGNING_TOKEN").unwrap();
    return encode(header, &signing_key, &payload, Algorithm::RS256);
}


#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_function_runs() {
        let value = issue_jwt(&User {
            id: 1,
            name: String::from("Person1"),
            email_verified: 1,
            email: String::from("person1@example.com"),
            password_hash: String::from("none"),
        });
    }
}
