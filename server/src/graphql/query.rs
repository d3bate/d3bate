pub struct Query;

use super::*;

fn encode_login_token(user_id: i32) -> Result<String, jwt::errors::Error> {
    jwt::encode(
        &jwt::Header::default(),
        &crate::auth::Claims {
            id: user_id,
            exp: chrono::Utc::now()
                .checked_add_signed(chrono::Duration::minutes(15))
                .unwrap(),
            claims_type: crate::auth::ClaimsType::Login,
        },
        &jwt::EncodingKey::from_secret(std::env::var("SECRET_KEY").unwrap().as_bytes()),
    )
}

#[juniper::graphql_object(Context=Context)]
impl Query {
    fn login_user(
        context: &Context,
        identifier: String,
        password: String,
    ) -> FieldResult<UserAuth> {
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        let found_user = match user::user
            .filter(user::email.eq(&identifier))
            .or_filter(user::name.eq(&identifier))
            .first::<data::User>(&context.connection.get().unwrap())
        {
            Ok(u) => u,
            Err(_) => return Err(permission_error(None)),
        };
        if bcrypt::verify(password, &found_user.password_hash).unwrap() {
            Ok(UserAuth {
                token: encode_login_token(found_user.id).unwrap(),
                user: found_user.into(),
            })
        } else {
            Err(auth_error())
        }
    }
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
            use data::schema::club_member::dsl as club_member;
            use data::schema::user::dsl as user;
            use diesel::prelude::*;
            match club::club
                .find(id)
                .inner_join(club_member::club_member.inner_join(user::user))
                .filter(user::id.eq(contextual_user.id))
                .select(data::schema::club::all_columns)
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
    fn clubs_of_user(context: &Context, role: i32) -> FieldResult<Vec<Club>> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match user::user
                .find(contextual_user.id)
                .inner_join(club_member::club_member.inner_join(club::club))
                .select(data::schema::club::all_columns)
                .filter(club_member::role.eq(role))
                .load::<data::Club>(&context.connection.get().unwrap())
            {
                Ok(clubs) => {
                    return Ok(clubs
                        .iter()
                        .map(|club| Club {
                            id: club.id,
                            name: club.name.clone(),
                            registered_school: club.registered_school.clone(),
                            school_verified: club.school_verified,
                            created: club.created,
                            join_code: club.join_code.clone(),
                        })
                        .collect::<Vec<Club>>())
                }
                Err(_) => return Err(server_error()),
            };
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn training_sessions_of_club(context: &Context, id: i32) -> FieldResult<Vec<TrainingSession>> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::training_session::dsl as training_session;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match club::club
                .find(id)
                .inner_join(training_session::training_session)
                .inner_join(club_member::club_member.inner_join(user::user))
                .filter(user::id.eq(contextual_user.id))
                .select((
                    data::schema::training_session::all_columns,
                    data::schema::club::all_columns,
                ))
                .load::<(data::TrainingSession, data::Club)>(&context.connection.get().unwrap())
            {
                Ok(sessions) => {
                    return Ok(sessions
                        .iter()
                        .map(|(ts_instance, club_instance)| TrainingSession {
                            id: ts_instance.id,
                            start_time: ts_instance.start_time,
                            end_time: ts_instance.end_time,
                            livestream: ts_instance.livestream,
                            description: ts_instance.description.clone(),
                            club: Club {
                                id: club_instance.id,
                                name: club_instance.name.clone(),
                                registered_school: club_instance.registered_school.clone(),
                                school_verified: club_instance.school_verified,
                                created: club_instance.created,
                                join_code: club_instance.join_code.clone(),
                            },
                        })
                        .collect::<Vec<TrainingSession>>())
                }
                Err(_) => return Err(server_error()),
            };
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn training_session(context: &Context, id: i32) -> FieldResult<TrainingSession> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::training_session::dsl as training_session;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match user::user
                .find(contextual_user.id)
                .inner_join(
                    club_member::club_member
                        .inner_join(club::club.inner_join(training_session::training_session)),
                )
                .select((
                    data::schema::training_session::all_columns,
                    data::schema::club::all_columns,
                ))
                .filter(training_session::id.eq(id))
                .first::<(data::TrainingSession, data::Club)>(&context.connection.get().unwrap())
            {
                Ok((training_session_instance, club_instance)) => Ok(TrainingSession {
                    id: training_session_instance.id,
                    start_time: training_session_instance.start_time,
                    end_time: training_session_instance.end_time,
                    livestream: training_session_instance.livestream,
                    description: training_session_instance.description,
                    club: Club {
                        id: club_instance.id,
                        name: club_instance.name,
                        registered_school: club_instance.registered_school,
                        school_verified: club_instance.school_verified,
                        created: club_instance.created,
                        join_code: club_instance.join_code,
                    },
                }),
                Err(_) => Err(server_error()),
            }
        } else {
            Err(not_logged_in_permission_error())
        }
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
        use data::schema::chat_message::dsl as chat_message;
        use data::schema::chat_message_thread::dsl as chat_message_thread;
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            if diesel::select(diesel::dsl::exists(
                chat_message_thread::chat_message_thread
                    .inner_join(
                        club::club.inner_join(club_member::club_member.inner_join(user::user)),
                    )
                    .filter(user::id.eq(contextual_user.id)),
            ))
            .get_result(&context.connection.get().unwrap())
            .unwrap()
            {
                let (chat_message_thread, selected_club) =
                    match chat_message_thread::chat_message_thread
                        .find(id)
                        .inner_join(club::club)
                        .select((
                            data::schema::chat_message_thread::all_columns,
                            data::schema::club::all_columns,
                        ))
                        .first::<(data::ChatMessageThread, data::Club)>(
                            &context.connection.get().unwrap(),
                        ) {
                        Ok(thread) => thread,
                        Err(_) => return Err(server_error()),
                    };
                let chat_messages = match chat_message::chat_message
                    .filter(chat_message::thread_id.eq(id))
                    .select(chat_message::id)
                    .load::<i32>(&context.connection.get().unwrap())
                {
                    Ok(c) => c,
                    Err(_) => return Err(server_error()),
                };
                return Ok(ChatMessageThread {
                    id: chat_message_thread.id,
                    last_active: chat_message_thread.last_active,
                    club: selected_club.into(),
                    title: chat_message_thread.title,
                    message_ids: chat_messages,
                });
            } else {
                return Err(permission_error(None));
            };
        } else {
            return Err(permission_error(None));
        }
    }
    fn chat_message_thread_messages(context: &Context, id: i32) -> FieldResult<Vec<ChatMessage>> {
        use data::schema::chat_message::dsl as chat_message;
        use data::schema::chat_message_thread::dsl as chat_message_thread;
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            if diesel::select(diesel::dsl::exists(
                chat_message_thread::chat_message_thread
                    .inner_join(
                        club::club.inner_join(club_member::club_member.inner_join(user::user)),
                    )
                    .filter(user::id.eq(contextual_user.id)),
            ))
            .get_result(&context.connection.get().unwrap())
            .unwrap()
            {
                match chat_message_thread::chat_message_thread
                    .inner_join(chat_message::chat_message.inner_join(user::user))
                    .filter(user::id.eq(contextual_user.id))
                    .select((
                        data::schema::chat_message::all_columns,
                        data::schema::user::all_columns,
                    ))
                    .load::<(data::ChatMessage, data::User)>(&context.connection.get().unwrap())
                {
                    Ok(messages) => {
                        return Ok(messages
                            .into_iter()
                            .map(|(message, author)| ChatMessage {
                                id: message.id,
                                thread_id: message.thread_id,
                                parent_id: message.chat_message_id,
                                created: message.created,
                                content: message.content,
                                author: User {
                                    id: author.id,
                                    name: author.name,
                                    email: author.email,
                                    created: author.created,
                                    email_verified: author.email_verified,
                                },
                            })
                            .collect::<Vec<ChatMessage>>())
                    }
                    Err(_) => return Err(server_error()),
                }
            } else {
                return Err(permission_error(None));
            }
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn chat_message(context: &Context, id: i32) -> FieldResult<ChatMessage> {
        use data::schema::chat_message::dsl as chat_message;
        use data::schema::chat_message_thread::dsl as chat_message_thread;
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match chat_message::chat_message
                .find(id)
                .inner_join(chat_message_thread::chat_message_thread.inner_join(
                    club::club.inner_join(club_member::club_member.inner_join(user::user)),
                ))
                .select(data::schema::chat_message::all_columns)
                .first::<data::ChatMessage>(&context.connection.get().unwrap())
            {
                Ok(message) => {
                    return Ok(ChatMessage {
                        id: message.id,
                        thread_id: message.thread_id,
                        parent_id: message.chat_message_id,
                        created: message.created,
                        content: message.content,
                        author: match user::user
                            .find(message.user_id)
                            .first::<data::User>(&context.connection.get().unwrap())
                        {
                            Ok(user) => User {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                created: user.created,
                                email_verified: user.email_verified,
                            },
                            Err(_) => return Err(server_error()),
                        },
                    })
                }
                Err(_) => return Err(server_error()),
            };
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
}
