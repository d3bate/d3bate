use std::collections::{HashMap, HashSet};
use std::option::Option;

use actix::{Actor, StreamHandler};
use actix::prelude::*;
use actix::Running;

use actix_web_actions::ws;
use std::time::{Duration, Instant};
use actix_web::{HttpRequest, web, HttpResponse, Error};

const HEARTBEAT_INTERVAL: Duration = Duration::from_secs(15);
const CLIENT_TIMEOUT: Duration = Duration::from_secs(30);

async fn live_debate(
    req: HttpRequest,
    stream: web::Payload,
    srv: web::Data<Addr<PerformantWebsocketsServer>>,
) -> Result<HttpResponse, Error> {
    ws::start(
        WsDebateSession {
            id: 0,
            hb: Instant::now(),
            debate: 0,
            authenticated: false,
            name: String::from("Placeholder Name"),
            username: String::from("placeholder_username"),
            addr: srv.get_ref().clone(),
            jwt: "".to_string(),
        },
        &req,
        stream,
    )
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct ChatMessage {
    pub text: String,
    // This should be the id in the database (not the hashmap)
    pub debate: usize,
}

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
pub struct VideoSnapshot {
    pub people_count: u8,
    pub faces: Vec<Face>,
}

#[derive(Message)]
#[type (usize)]
pub struct AudioSnapshot {}


/// Represents a debate
/// The `session_id` field should correspond to a database entry
pub struct Debate {
    pub users: HashSet<usize>,
    pub session_id: usize,
}

pub struct PerformantWebsocketsServer {
    sessions: HashMap<usize, Recipient<Message>>,
    debates: HashMap<usize, Debate>,
}


impl Actor for PerformantWebsocketsServer {
    type Context = Context<Self>;
}

pub struct WsDebateSession {
    id: usize,
    hb: std::time::Instant,
    debate: usize,
    authenticated: bool,
    name: String,
    username: String,
    addr: Addr<PerformantWebsocketsServer>,
    jwt: String,
}

impl Actor for WsDebateSession {
    type Context = ws::WebsocketContext<Self>;
    fn started(&mut self, ctx: &mut Self::Context) {
        self.hb(ctx);
        let addr = ctx.address();
    }
    fn stopping(&mut self, ctx: &mut Self::Context) -> Running {
        Running::Stop
    }
}

impl Handler<VideoSnapshot> for WsDebateSession {
    type Result = ();
    fn handle(&mut self, msg: VideoSnapshot, ctx: &mut self::Context<Self>) {
        ctx.ping(msg);
    }
}