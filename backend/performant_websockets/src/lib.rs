use std::collections::{HashMap, HashSet};
use std::option::Option;

use actix::{Actor, StreamHandler};
use actix::prelude::*;

use actix_web_actions::ws;

mod db;

#[derive(Message)]
#[rtype(result = "()")]
pub struct ChatMessage(pub String);

#[derive(Message)]
#[rtype(usize)]
struct UserJoin {
    pub addr: Recipeient<Message>
}

#[derive(Message)]
#[rtype(usize)]
struct UserRequestDebateJoin {
    // id should correspond to the id of a column in the 'training_session' table
    pub debate: usize,
}


/// The face struct represents data from the client about a specific face. More than one person might
/// use a single device. All the fields are instances of the `Option` enum because the client will
/// only send data to the server if its value has changed.
/// The client is using expo's [face detection API](https://docs.expo.io/versions/latest/sdk/facedetector/)
/// which is where the fields of the struct come from.
struct Face {
    pub face_id: i32,
    pub bounds_origin: Option<(i32, i32)>,
    pub bounds_size: Option<(i32, i32)>,
    pub roll_angle: f64,
    pub yaw_angle: f64,
    pub smiling_probability: Option<f64>,
    pub left_ear_position: Option<(i32, i32)>,
    pub right_ear_position: Option<(i32, i32)>,
    pub left_eye_position: Option<(i32, i32)>,
    pub left_eye_open_prob: Option<f64>,
    pub right_eye_position: Option<(i32, i32)>,
    pub right_eye_open_prob: Option<f64>,
    pub left_cheek_position: Option<(i32, i32)>,
    pub right_cheek_position: Option<(i32, i32)>,
    pub mouth_position: Option<(i32, i32)>,
    pub left_mouth_position: Option<(i32, i32)>,
    pub right_mouth_position: Option<(i32, i32)>,
    pub nose_base_position: Option<(i32, i32)>,
}

#[derive(Message)]
#[rtype(usize)]
struct VideoSnapshot {
    pub people_count: u8,
    pub faces: Vec<Face>,
}


pub struct PerformantWebsockets {
    sessions: HashMap<usize, Recipient<Message>>,
    debates: HashMap<String, HashSet<usize>>,
}


impl Actor for PerformantWebsockets {
    type Context = Context<Self>;
}

impl PerformantWebsockets {
    pub fn new() -> Self {
        Self {
            sessions: HashMap::new(),
            debates: HashMap::new(),
        }
    }

    pub fn run() {}
}


#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
