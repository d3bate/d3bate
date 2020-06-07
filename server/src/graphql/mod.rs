//! The GraphQL server.

mod mutation;
mod query;

use mutation::Mutations;
use query::Query;

use juniper::{EmptySubscription, FieldResult, RootNode};

pub type Schema = RootNode<'static, Query, Mutations, EmptySubscription<Context>>;

pub fn schema() -> Schema {
    Schema::new(Query, Mutations, EmptySubscription::default())
}

#[derive(juniper::GraphQLObject)]
pub struct User {
    id: i32,
    name: String,
    email: String,
    created: chrono::NaiveDateTime,
    email_verified: bool,
}

impl std::convert::From<data::User> for User {
    fn from(user: data::User) -> Self {
        User {
            id: user.id,
            name: user.name.clone(),
            email: user.email.clone(),
            created: user.created,
            email_verified: user.email_verified,
        }
    }
}

#[derive(juniper::GraphQLInputObject)]
#[graphql(description = "Register as a new user.")]
struct NewUser {
    name: String,
    email: String,
    password: String,
    pgp: Option<String>,
}

#[derive(juniper::GraphQLObject)]
struct UserAuth {
    user: User,
    token: String,
}

#[derive(juniper::GraphQLObject)]
#[graphql(description = "A single debating club.")]
struct Club {
    pub id: i32,
    pub name: String,
    pub registered_school: String,
    pub school_verified: bool,
    pub created: chrono::NaiveDateTime,
    pub join_code: String,
}

impl std::convert::From<data::Club> for Club {
    fn from(old_club: data::Club) -> Self {
        Club {
            id: old_club.id,
            name: old_club.name,
            registered_school: old_club.registered_school,
            school_verified: old_club.school_verified,
            created: old_club.created,
            join_code: old_club.join_code,
        }
    }
}

#[derive(juniper::GraphQLObject)]
#[graphql(description = "A single training session.")]
struct TrainingSession {
    id: i32,
    start_time: chrono::NaiveDateTime,
    end_time: chrono::NaiveDateTime,
    livestream: bool,
    description: String,
    club: Club,
}

#[derive(juniper::GraphQLObject)]
#[graphql(description = "Attendance of a user for a training session.")]
struct TrainingSessionAttendance {
    id: i32,
    training_session: TrainingSession,
    user: User,
    attending: bool,
}

#[derive(juniper::GraphQLObject)]
#[graphql(description = "A thread of chat messages.")]
/// A chat message thread
struct ChatMessageThread {
    id: i32,
    last_active: chrono::NaiveDateTime,
    club: Club,
    title: String,
    message_ids: Vec<i32>,
}

#[derive(juniper::GraphQLObject)]
#[graphql(description = "A single chat message.")]
/// Represents a single chat message.
struct ChatMessage {
    id: i32,
    thread_id: i32,
    parent_id: Option<i32>,
    created: chrono::NaiveDateTime,
    content: String,
    author: User,
}

/// Context for GraphQL queries. Includes a database and (optional) authentication.
pub struct Context {
    pub user: Option<data::User>,
    pub connection: actix_web::web::Data<crate::Pool>,
}

impl juniper::Context for Context {}

fn auth_error() -> juniper::FieldError {
    juniper::FieldError::new(
        "You must be logged in to access this.",
        juniper::graphql_value!({"http_error_code": "403"}),
    )
}

fn permission_error(optional_explanation: Option<String>) -> juniper::FieldError {
    match optional_explanation {
        Some(explanation) => juniper::FieldError::new(
            &format!("You don't have permission to do that. {}", explanation),
            juniper::graphql_value!({"http_error_code": "403"}),
        ),
        None => juniper::FieldError::new(
            "You don't have permission to do that",
            juniper::graphql_value!({"http_error_code": "403"}),
        ),
    }
}

fn not_logged_in_permission_error() -> juniper::FieldError {
    permission_error(Some("You must be logged in to do this.".into()))
}

fn server_error() -> juniper::FieldError {
    juniper::FieldError::new(
        "There was a server error processing your request.",
        juniper::graphql_value!({"http_error_code": "500"}),
    )
}
