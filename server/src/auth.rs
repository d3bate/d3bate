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
