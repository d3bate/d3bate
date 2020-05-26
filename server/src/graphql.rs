//! The GraphQL server.
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

#[derive(juniper::GraphQLInputObject)]
#[graphql(description = "Register as a new user.")]
struct NewUser {
    name: String,
    email: String,
    password: String,
    pgp: Option<String>,
}

#[derive(juniper::GraphQLObject)]
struct Club {
    pub id: i32,
    pub name: String,
    pub registered_school: String,
    pub school_verified: bool,
    pub created: bool,
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
struct TrainingSession {
    id: i32,
    start_time: chrono::NaiveDateTime,
    end_time: chrono::NaiveDateTime,
    livestream: bool,
    description: String,
    club: Club,
}

#[derive(juniper::GraphQLObject)]
struct TrainingSessionAttendance {
    id: i32,
    training_session: TrainingSession,
    user: User,
    attending: bool,
}

#[derive(juniper::GraphQLObject)]
/// A chat message thread
struct ChatMessageThread {
    id: i32,
    last_active: chrono::NaiveDateTime,
    club: Club,
    title: String,
    message_ids: Vec<i32>,
}

#[derive(juniper::GraphQLObject)]
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

pub struct Query;

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

fn server_error() -> juniper::FieldError {
    juniper::FieldError::new(
        "There was a server error processing your request.",
        juniper::graphql_value!({"http_error_code": "500"}),
    )
}

#[juniper::graphql_object(Context=Context)]
impl Query {
    fn user(context: &Context, id: i32) -> FieldResult<User> {
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match user::user
                .find(id)
                .first::<data::User>(&context.connection.get().unwrap())
            {
                Ok(u) => {
                    if u.id == contextual_user.id {
                        Ok(User {
                            id: u.id,
                            name: u.name.clone(),
                            email: u.email.clone(),
                            created: u.created,
                            email_verified: u.email_verified,
                        })
                    } else {
                        Err(permission_error(None))
                    }
                }
                Err(_) => Err(permission_error(None)),
            }
        } else {
            Err(auth_error())
        }
    }
    fn club(context: &Context, id: i32) -> FieldResult<Club> {
        if let Some(contextual_user) = &context.user {
            use data::schema::club::dsl as club;
            use diesel::prelude::*;
            match club::club
                .find(id)
                .first::<data::Club>(&context.connection.get().unwrap())
            {
                Ok(club) => Ok(club.into()),
                Err(_) => Err(juniper::FieldError::new(
                    "Could not find that club.",
                    juniper::graphql_value!({"error": "404"}),
                )),
            }
        } else {
            Err(auth_error())
        }
    }
    fn training_session(context: &Context, id: i32) -> FieldResult<TrainingSession> {
        todo!()
    }
    fn training_session_attendance(
        context: &Context,
        id: i32,
    ) -> FieldResult<TrainingSessionAttendance> {
        use data::schema::club::dsl as club;
        use data::schema::training_session::dsl as ts;
        use data::schema::training_session_attendance::dsl as tsa;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match tsa::training_session_attendance
                .filter(tsa::id.eq(id))
                .first::<data::TrainingSessionAttendance>(&context.connection.get().unwrap())
            {
                Ok(tsa_val) => {
                    if tsa_val.user_id == contextual_user.id {
                        let training_session = match ts::training_session
                            .find(tsa_val.training_session_id)
                            .first::<data::TrainingSession>(&context.connection.get().unwrap())
                        {
                            Ok(training_session) => training_session,
                            Err(_) => {
                                return Err(juniper::FieldError::new(
                                    "Couldn't find the training session related to that item.",
                                    juniper::graphql_value!({"error": "404"}),
                                ))
                            }
                        };
                        let club: data::Club = match club::club
                            .find(training_session.club_id)
                            .first(&context.connection.get().unwrap())
                        {
                            Ok(club) => club,
                            Err(_) => {
                                return Err(juniper::FieldError::new(
                                    "Couldn't find the club for that training session.",
                                    juniper::graphql_value!({"error": "404"}),
                                ))
                            }
                        };
                        let user_val: data::User = match user::user
                            .find(tsa_val.user_id)
                            .first::<data::User>(&context.connection.get().unwrap())
                        {
                            Ok(user) => user,
                            Err(_) => {
                                return Err(juniper::FieldError::new(
                                    "Couldn't find the user for that training session.",
                                    juniper::graphql_value!({"error": "404"}),
                                ))
                            }
                        };
                        Ok(TrainingSessionAttendance {
                            id: tsa_val.id,
                            attending: tsa_val.attending,
                            training_session: TrainingSession {
                                id: training_session.id,
                                start_time: training_session.start_time,
                                end_time: training_session.end_time,
                                livestream: training_session.livestream,
                                description: training_session.description,
                                club: Club {
                                    id: club.id,
                                    name: club.name,
                                    join_code: club.join_code,
                                    registered_school: club.registered_school,
                                    school_verified: club.school_verified,
                                    created: club.created,
                                },
                            },
                            user: User {
                                created: user_val.created,
                                name: user_val.name,
                                id: user_val.id,
                                email: user_val.email,
                                email_verified: user_val.email_verified,
                            },
                        })
                    } else {
                        Err(permission_error(None))
                    }
                }
                Err(_) => Err(juniper::FieldError::new(
                    "Couldn't find that item.",
                    juniper::graphql_value!({"error": "403"}),
                )),
            }
        } else {
            Err(auth_error())
        }
    }
    fn chat_message_thread(context: &Context, id: i32) -> FieldResult<ChatMessageThread> {
        todo!()
    }
    fn chat_message_thread_messages(context: &Context, id: i32) -> FieldResult<Vec<ChatMessage>> {
        todo!()
    }
    fn chat_message(context: &Context, id: i32) -> FieldResult<ChatMessage> {
        todo!()
    }
}
pub struct Mutations;

#[juniper::graphql_object(Context=Context)]
impl Mutations {
    fn register_user(context: &Context, new_user: NewUser) -> FieldResult<User> {
        use bcrypt::{hash, DEFAULT_COST};
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        let password_hash: String = match hash(new_user.password, DEFAULT_COST) {
            Ok(h) => h,
            Err(_) => {
                return Err(juniper::FieldError::new(
                    "Couldn't hash the provided password.",
                    juniper::graphql_value!({"error": "500"}),
                ))
            }
        };
        match diesel::insert_into(user::user)
            .values(data::NewUser {
                name: &new_user.name,
                email: &new_user.email,
                password_hash: &password_hash,
                pgp: new_user.pgp.as_deref(),
                created: chrono::Utc::now().naive_utc(),
                email_verified: false,
            })
            .get_result::<data::User>(&context.connection.get().unwrap())
        {
            Ok(u) => {
                #[cfg(feature = "email")]
                #[cfg(not(test))]
                {
                    use askama::Template;
                    let jwt = jwt::encode(
                        &jwt::Header::default(),
                        &crate::auth::Claims::new(u.id, None, crate::auth::ClaimsType::EmailVerify),
                        &jwt::EncodingKey::from_secret(
                            std::env::var("SECRET_KEY").unwrap().as_bytes(),
                        ),
                    )
                    .unwrap();
                    // TODO: find a nicer solution (don't use `futures::executor::block_on`)
                    futures::executor::block_on(
                        crate::email::Email::new(
                            vec![&u.email],
                            "Confirm your d3bate email",
                            "bureaucrat+do_not_reply@debating.web.app",
                            Some(
                                crate::templates::ConfirmEmailTemplate::new(&jwt)
                                    .render()
                                    .unwrap()
                                    .as_str(),
                            ),
                            Some(""),
                        )
                        .send(),
                    );
                }
                Ok(User {
                    id: u.id,
                    name: u.name,
                    email_verified: u.email_verified,
                    email: u.email,
                    created: u.created,
                })
            }
            Err(_) => return Err(server_error()),
        }
    }
    fn request_password_reset(context: &Context, email: String) -> FieldResult<User> {
        todo!()
    }
    fn update_password(
        context: &Context,
        old_password: String,
        new_password: String,
    ) -> FieldResult<User> {
        use bcrypt::{verify, DEFAULT_COST};
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match verify(old_password, &contextual_user.password_hash) {
                Ok(verified) => {
                    if verified {
                        let new_hash = bcrypt::hash(new_password, DEFAULT_COST).unwrap();
                        match diesel::update(user::user)
                            .set(user::password_hash.eq(new_hash))
                            .filter(user::id.eq(contextual_user.id))
                            .get_result::<data::User>(&context.connection.get().unwrap())
                        {
                            Ok(_) => Ok(User {
                                id: contextual_user.id,
                                name: contextual_user.name.clone(),
                                email_verified: contextual_user.email_verified,
                                email: contextual_user.email.clone(),
                                created: contextual_user.created,
                            }),
                            Err(_) => Err(server_error()),
                        }
                    } else {
                        Err(permission_error(Some(
                            "Your passwords don't match.".to_string(),
                        )))
                    }
                }
                Err(_) => Err(server_error()),
            }
        } else {
            return Err(permission_error(Some(
                "You must be logged in to do this.".to_string(),
            )));
        }
    }
    fn update_email(context: &Context, password: String) -> FieldResult<User> {
        todo!()
    }
    fn join_club(context: &Context, join_code: String) -> FieldResult<Club> {
        todo!()
    }
    fn leave_club(context: &Context, club_id: i32) -> FieldResult<Club> {
        todo!()
    }
    fn add_chat_message(context: &Context) -> FieldResult<ChatMessage> {
        todo!()
    }
    fn remove_chat_message(context: &Context) -> FieldResult<ChatMessage> {
        todo!()
    }
    fn add_training_session(context: &Context) -> FieldResult<ChatMessage> {
        todo!()
    }
    fn remove_training_session(context: &Context) -> FieldResult<TrainingSession> {
        todo!()
    }
    fn set_training_session_attendance(
        context: &Context,
        session_id: i32,
        attending: bool,
    ) -> FieldResult<TrainingSessionAttendance> {
        todo!()
    }
}
