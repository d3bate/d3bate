use actix::prelude::*;
use std::collections::{HashMap, HashSet};
use std::io::Bytes;
use rand::rngs::ThreadRng;
use rand::Rng;

#[derive(Message)]
#[rtype(result = "()")]
pub struct Message(pub String);

#[derive(Message)]
#[rtype(usize)]
pub struct Connect {
    pub addr: Recipient<Message>
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Disconnect {
    pub id: usize
}

#[derive(Message, Clone)]
#[rtype(result = "()")]
pub struct AudioPacket {
    pub id: usize,
    pub audio: String,
    pub debate: String,
}

#[derive(Clone)]
pub struct Face {
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

#[derive(Clone)]
pub struct VideoPacket {
    pub id: usize,
    pub faces: Vec<Face>,
}

#[derive(Message)]
#[rtype(result = "()")]
pub struct Join {
    pub id: usize,
    pub join_code: String,
    pub name: String,
}

pub struct Speaker {
    pub id: usize,
    pub name: String,
    // Preferred gender pronouns
    pub pgp: String,
}

pub struct Team {
    pub speakers: Vec<Speaker>
}

pub enum DebateStage {
    Prep,
    Debate,
    Feedback,
}

pub enum CurrentSpeech {
    PM,
    DPM,
    LO,
    DLO,
    MG,
    GW,
    MO,
    OW,
}

pub struct AudienceMember {
    pub id: usize,
    pub name: String,
}

pub struct Debate {
    pub current_speaker: usize,
    pub join_code: String,
    pub teams: Vec<Team>,
    pub stage: DebateStage,
    pub current_speech: Option<CurrentSpeech>,
    pub audience: Vec<AudienceMember>,
}

pub struct DebateServer {
    sessions: HashMap<usize, Recipient<Message>>,
    debates: HashMap<String, Debate>,
    rng: ThreadRng,
}

impl DebateServer {
    fn send_message(&self, debate: &str, message: &str, skip_id: usize) {
        if let Some(debate) = self.debates.get(debate) {
            for team in &debate.teams {
                for speaker in &team.speakers {
                    if speaker.id != skip_id {
                        if let Some(addr) = self.sessions.get(&speaker.id) {
                            let _ = addr.do_send(Message(String::from(message)));
                        }
                    }
                }
            }
        }
    }
}

impl Actor for DebateServer {
    type Context = Context<Self>;
}

impl Handler<Connect> for DebateServer {
    type Result = usize;
    fn handle(&mut self, msg: Connect, _: &mut Context<Self>) -> Self::Result {
        let id = self.rng.gen::<usize>();
        self.sessions.insert(id, msg.addr);
        id
    }
}

impl Handler<Disconnect> for DebateServer {
    type Result = ();
    fn handle(&mut self, msg: Disconnect, _: &mut Context<Self>) {
        let mut debates: Vec<String> = Vec::new();
        if self.sessions.remove(&msg.id).is_some() {
            for (name, debate) in &mut self.debates {
                for team in &mut debate.teams {
                    let mut remove: Vec<usize> = Vec::new();
                    for (i, speaker) in team.speakers.iter().enumerate() {
                        if speaker.id == msg.id {
                            remove.push(i);
                        }
                    }
                    for item in remove {
                        team.speakers.remove(item);
                    }
                }
            }
        }
    }
}

impl Handler<Join> for DebateServer {
    type Result = ();
    fn handle(&mut self, msg: Join, _: Context<Self>) {
        for (name, debate) in &mut self.debates {
            if msg.join_code == debate.join_code {
                debate.audience.push(AudienceMember {
                    id: msg.id,
                    name: msg.name,
                });
                self.send_message(name, "{\"type\": \"success\", \"message\":\"You have join that debate.\", \"suggestion\": \"Start watching\"}", msg.id)
            }
        }
    }
}