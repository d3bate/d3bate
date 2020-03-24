use std::collections::HashMap;


use actix::{Actor, StreamHandler};

use actix_web_actions::ws;

mod db;

struct ReceiveVideo;

impl Actor for ReceiveVideo {
    type Context = ws::WebsocketContext<Self>;
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for ReceiveVideo {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => ctx.pong(&msg),
            Ok(ws::Messge::Text(text)) => ctx.text(text),
            Ok(ws::Message::Binary(bin)) => ctx.binary(bin),
            _ => (),
        }
    }
}


pub struct PerformantWebsockets {
    sessions: HashMap<String, String>
}

impl PerformantWebsockets {
    pub fn new() -> Self {
        Self {
            sessions: HashMap::new()
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
