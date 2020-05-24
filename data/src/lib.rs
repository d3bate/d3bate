#[macro_use]
extern crate diesel;

pub mod schema;

use schema::{
    chat_message, chat_message_thread, club, training_session, training_session_attendance, user,
};

#[derive(Queryable, Identifiable)]
#[table_name = "user"]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password_hash: String,
    pub created: chrono::NaiveDateTime,
    pub email_verified: bool,
    pub pgp: Option<String>,
}

#[derive(Insertable)]
#[table_name = "user"]
struct NewUser<'a> {
    name: &'a str,
    email: &'a str,
    password_hash: &'a str,
    created: chrono::NaiveDateTime,
    email_verified: bool,
    pgp: Option<&'a str>,
}

#[derive(AsChangeset)]
#[table_name = "user"]
struct UpdateUser<'a> {
    name: Option<&'a str>,
    email: Option<&'a str>,
    password_hash: Option<&'a str>,
    created: Option<chrono::NaiveDateTime>,
    email_verified: bool,
    pgp: Option<&'a str>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "club"]
struct Club {
    id: i32,
    name: String,
    registered_school: String,
    school_verified: bool,
    created: bool,
    join_code: String,
}

#[derive(Insertable)]
#[table_name = "club"]
struct NewClub<'a> {
    name: &'a str,
    registered_school: &'a str,
    school_verified: bool,
    created: bool,
    join_code: &'a str,
}

#[derive(AsChangeset)]
#[table_name = "club"]
struct UpdateClub<'a> {
    name: Option<&'a str>,
    registered_school: Option<&'a str>,
    school_verified: Option<bool>,
    created: Option<bool>,
    join_code: Option<&'a str>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "training_session"]
struct TrainingSession {
    id: i32,
    start_time: chrono::NaiveDateTime,
    end_time: chrono::NaiveDateTime,
    livestream: bool,
    description: String,
    club_id: i32,
}

#[derive(Insertable)]
#[table_name = "training_session"]
struct NewTrainingSession<'a> {
    id: i32,
    start_time: chrono::NaiveDateTime,
    end_time: chrono::NaiveDateTime,
    livestream: bool,
    description: &'a str,
    club_id: i32,
}

#[derive(AsChangeset)]
#[table_name = "training_session"]
struct UpdateTrainingSession<'a> {
    start_time: Option<chrono::NaiveDateTime>,
    end_time: Option<chrono::NaiveDateTime>,
    livestream: Option<bool>,
    description: Option<&'a str>,
    club_id: Option<i32>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "training_session_attendance"]
struct TrainingSessionAttendance {
    id: i32,
    training_session_id: i32,
    user_id: i32,
    attending: bool,
}

#[derive(Insertable)]
#[table_name = "training_session_attendance"]
struct NewTrainingSessionAttendance {
    training_session_id: i32,
    user_id: i32,
    attending: bool,
}

#[derive(AsChangeset)]
#[table_name = "training_session_attendance"]
struct UpdateTrainingSessionAttendance {
    training_session_id: Option<i32>,
    user_id: Option<i32>,
    attending: Option<bool>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "chat_message"]
struct ChatMessage {
    id: i32,
    chat_message_id: Option<i32>,
    created: chrono::NaiveDateTime,
    content: String,
    user_id: Option<i32>,
}

#[derive(Insertable)]
#[table_name = "chat_message"]
struct NewChatMessage<'a> {
    thread_id: i32,
    chat_message_id: i32,
    created: chrono::NaiveDateTime,
    content: &'a str,
    user_id: i32,
}

#[derive(AsChangeset)]
#[table_name = "chat_message"]
struct UpdateChatMessage<'a> {
    thread_id: Option<i32>,
    chat_message_id: Option<i32>,
    created: Option<chrono::NaiveDateTime>,
    content: Option<&'a str>,
    user_id: Option<i32>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "chat_message_thread"]
struct ChatMessageThread {
    id: i32,
    last_active: chrono::NaiveDateTime,
    club_id: i32,
    title: String,
}
#[derive(Insertable)]
#[table_name = "chat_message_thread"]
struct NewChatMessageThread<'a> {
    last_active: chrono::NaiveDateTime,
    club_id: i32,
    title: &'a str,
}

#[derive(AsChangeset)]
#[table_name = "chat_message_thread"]
struct UpdateChatMessageThread<'a> {
    last_active: Option<chrono::NaiveDateTime>,
    club_id: Option<i32>,
    title: Option<&'a str>,
}
