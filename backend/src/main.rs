#![feature(proc_macro_hygiene, decl_macro, proc_macro_derive)]

#[macro_use]
extern crate diesel;
extern crate dotenv;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
extern crate rocket_contrib;
#[macro_use]
extern crate serde_derive;

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
