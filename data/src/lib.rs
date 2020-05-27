#[macro_use]
extern crate diesel;

pub mod schema;

use schema::{
    chat_message, chat_message_thread, club, club_member, training_session,
    training_session_attendance, user,
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
pub struct NewUser<'a> {
    pub name: &'a str,
    pub email: &'a str,
    pub password_hash: &'a str,
    pub created: chrono::NaiveDateTime,
    pub email_verified: bool,
    pub pgp: Option<&'a str>,
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
pub struct Club {
    pub id: i32,
    pub name: String,
    pub registered_school: String,
    pub school_verified: bool,
    pub created: chrono::NaiveDateTime,
    pub join_code: String,
}

#[derive(Insertable)]
#[table_name = "club"]
pub struct NewClub<'a> {
    pub name: &'a str,
    pub registered_school: &'a str,
    pub school_verified: bool,
    pub created: chrono::NaiveDateTime,
    pub join_code: &'a str,
}

#[derive(AsChangeset)]
#[table_name = "club"]
struct UpdateClub<'a> {
    name: Option<&'a str>,
    registered_school: Option<&'a str>,
    school_verified: Option<bool>,
    created: Option<chrono::NaiveDateTime>,
    join_code: Option<&'a str>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "club_member"]
pub struct ClubMember {
    id: i32,
    user_id: i32,
    club_id: i32,
    role: i32,
}

#[derive(Insertable)]
#[table_name = "club_member"]
pub struct NewClubMember {
    pub user_id: i32,
    pub club_id: i32,
}

#[derive(AsChangeset)]
#[table_name = "club_member"]
pub struct UpdateClubMember {
    pub user_id: Option<i32>,
    pub club_id: Option<i32>,
}

#[derive(Queryable, Identifiable)]
#[table_name = "training_session"]
pub struct TrainingSession {
    pub id: i32,
    pub start_time: chrono::NaiveDateTime,
    pub end_time: chrono::NaiveDateTime,
    pub livestream: bool,
    pub description: String,
    pub club_id: i32,
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
pub struct TrainingSessionAttendance {
    pub id: i32,
    pub training_session_id: i32,
    pub user_id: i32,
    pub attending: bool,
}

#[derive(Insertable)]
#[table_name = "training_session_attendance"]
pub struct NewTrainingSessionAttendance {
    pub training_session_id: i32,
    pub user_id: i32,
    pub attending: bool,
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
pub struct ChatMessage {
    pub id: i32,
    pub thread_id: i32,
    pub chat_message_id: Option<i32>,
    pub created: chrono::NaiveDateTime,
    pub content: String,
    pub user_id: i32,
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
pub struct ChatMessageThread {
    pub id: i32,
    pub last_active: chrono::NaiveDateTime,
    pub club_id: i32,
    pub title: String,
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
