use serde::{Deserialize, Serialize};
#[derive(Debug, Serialize, Deserialize, Copy, Clone, PartialEq)]
pub enum ClaimsType {
    Login,
    EmailVerify,
    PwdReset,
}

#[derive(Debug, PartialEq, Serialize, Deserialize, Copy, Clone)]
pub struct Claims {
    /// The user id.
    pub id: i32,
    /// When the token expires.
    pub exp: chrono::DateTime<chrono::Utc>,
    /// The type of token represented (a login token, an email verification token or a password reset token)
    pub claims_type: ClaimsType,
}

impl actix_web::FromRequest for Claims {
    type Error = actix_web::error::Error;
    type Future = futures::future::Ready<Result<Self, Self::Error>>;
    type Config = ();
    fn from_request(req: &actix_web::HttpRequest, _: &mut actix_web::dev::Payload) -> Self::Future {
        match req.headers().get("x-api-token") {
            Some(token) => {
                match jwt::decode::<Claims>(
                    token.to_str().unwrap(),
                    &jwt::DecodingKey::from_secret(
                        &std::env::var("SECRET_KEY").unwrap().as_bytes(),
                    ),
                    &jwt::Validation::default(),
                ) {
                    Ok(claims) => futures::future::ok(claims.claims),
                    Err(_) => futures::future::err(actix_web::error::ErrorBadRequest(
                        "The token supplied is invalid.",
                    )),
                }
            }
            None => futures::future::err(actix_web::error::ErrorBadRequest(
                "A token was not supplied.",
            )),
        }
    }
}
