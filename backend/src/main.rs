#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate diesel;
extern crate frank_jwt;
#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;
#[macro_use]
extern crate serde_json;

mod users;
mod schema;
#[database("sqlite_db")]
struct SQLiteDbConn(diesel::SqliteConnection);

fn rocket() -> rocket::Rocket {
    rocket::ignite()
        .attach(SQLiteDbConn::fairing())
}

fn main() {
    rocket().launch();
}
