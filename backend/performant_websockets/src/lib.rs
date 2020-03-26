#![feature(slice_patterns)]

#[macro_use]
extern crate diesel;


mod server;
mod db;

pub struct PerformantWebsockets {}

impl PerformantWebsockets {
    fn new() -> Self {
        Self {}
    }
    /// Runs websockets and the main application in parallel.
    /// It is intended for this function to accept a Flask app as a parameter and spawn this on a
    /// separate thread.
    pub fn run() {}
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
