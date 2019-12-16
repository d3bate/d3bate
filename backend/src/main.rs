#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use]
extern crate rocket;
#[macro_use]
extern crate rocket_contrib;

use rocket_contrib::databases::diesel;

#[database("sqlite_db")]
struct SQLiteDbConn(diesel::SqliteConnection);

fn rocket() -> rocket::Rocket {
    rocket::ignite()
        .attach(SQLiteDbConn::fairing())
}

fn main() {
    rocket().launch();
}
