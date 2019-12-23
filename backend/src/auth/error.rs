use std::error;
use std::fmt;

type Result<T> = std::result::Result<T, DoubleError>;

#[derive(Debug, Clone)]
struct AuthError;

impl fmt::Display for AuthError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Error while authenticating.")
    }
}