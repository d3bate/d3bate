use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize)]
pub struct RequestError {
    pub error_message: String,
    pub error_code: u32,
}