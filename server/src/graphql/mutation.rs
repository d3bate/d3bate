pub struct Mutations;

use super::*;

#[derive(GraphQLObject)]
struct DeleteOperationSuccess {
    message: String,
}

#[derive(GraphQLInputObject)]
struct NewClub {
    name: String,
    school_website: String,
}

#[derive(GraphQLInputObject)]
struct NewTrainingSession {
    start_time: chrono::NaiveDateTime,
    end_time: chrono::NaiveDateTime,
    livestream: bool,
    description: String,
    club_id: i32,
}

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
    fn create_club(context: &Context, club: NewClub) -> FieldResult<Club> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match diesel::insert_into(club::club)
                .values(data::NewClub {
                    name: &club.name,
                    registered_school: &club.school_website,
                    school_verified: false,
                    created: chrono::Utc::now().naive_utc(),
                    join_code: &base64::encode(
                        &bcrypt::hash(&club.name, bcrypt::DEFAULT_COST)
                            .unwrap()
                            .get(0..6)
                            .unwrap()
                            .as_bytes(),
                    ),
                })
                .returning(data::schema::club::all_columns)
                .get_result::<data::Club>(&context.connection.get().unwrap())
            {
                Ok(club_result) => {
                    match diesel::insert_into(club_member::club_member)
                        .values(data::NewClubMember {
                            user_id: contextual_user.id,
                            club_id: club_result.id,
                            role: 3,
                        })
                        .execute(&context.connection.get().unwrap())
                    {
                        Ok(_) => {
                            return Ok(Club {
                                id: club_result.id,
                                name: club_result.name,
                                registered_school: club_result.registered_school,
                                school_verified: club_result.school_verified,
                                created: club_result.created,
                                join_code: club_result.join_code,
                            });
                        }
                        Err(_) => {
                            return Err(server_error());
                        }
                    };
                }
                Err(_) => return Err(server_error()),
            };
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn join_club(context: &Context, join_code: String) -> FieldResult<Club> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            match club::club
                .filter(club::join_code.eq(join_code))
                .first::<data::Club>(&context.connection.get().unwrap())
            {
                Ok(club) => {
                    match diesel::insert_into(club_member::club_member)
                        .values(data::NewClubMember {
                            club_id: club.id,
                            user_id: contextual_user.id,
                            role: 1,
                        })
                        .execute(&context.connection.get().unwrap())
                    {
                        Ok(_) => return Ok(Club::from(club)),
                        Err(_) => return Err(server_error()),
                    }
                }
                Err(_) => {
                    return Err(permission_error(Some(
                        "The join code provided is invalid.".into(),
                    )))
                }
            }
        } else {
            return Err(not_logged_in_permission_error());
        }
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
    fn add_training_session(
        context: &Context,
        training_session: NewTrainingSession,
    ) -> FieldResult<TrainingSession> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::training_session::dsl as training_session;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contexual_user) = &context.user {
            if diesel::select(diesel::dsl::exists(
                club::club
                    .inner_join(club_member::club_member.inner_join(user::user))
                    .filter(club::id.eq(training_session.club_id))
                    .filter(user::id.eq(contexual_user.id)),
            ))
            .get_result(&context.connection.get().unwrap())
            .unwrap()
            {
                match diesel::insert_into(training_session::training_session)
                    .values(data::NewTrainingSession {
                        start_time: training_session.start_time,
                        end_time: training_session.end_time,
                        livestream: training_session.livestream,
                        description: &training_session.description,
                        club_id: training_session.club_id,
                    })
                    .returning(data::schema::training_session::all_columns)
                    .get_result::<data::TrainingSession>(&context.connection.get().unwrap())
                {
                    Ok(training_session) => {
                        return Ok(TrainingSession {
                            id: training_session.id,
                            start_time: training_session.start_time,
                            end_time: training_session.end_time,
                            livestream: training_session.livestream,
                            description: training_session.description,
                            club: match club::club
                                .find(training_session.club_id)
                                .first::<data::Club>(&context.connection.get().unwrap())
                            {
                                Ok(s) => s.into(),
                                Err(_) => return Err(server_error()),
                            },
                        })
                    }
                    Err(_) => return Err(server_error()),
                };
            } else {
                return Err(permission_error(None));
            }
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn remove_training_session(context: &Context, id: i32) -> FieldResult<DeleteOperationSuccess> {
        use data::schema::club::dsl as club;
        use data::schema::club_member::dsl as club_member;
        use data::schema::training_session::dsl as training_session;
        use data::schema::user::dsl as user;
        use diesel::prelude::*;
        if let Some(contextual_user) = &context.user {
            if match diesel::select(diesel::dsl::exists(
                training_session::training_session
                    .find(id)
                    .inner_join(
                        club::club.inner_join(club_member::club_member.inner_join(user::user)),
                    )
                    .filter(club_member::role.gt(1))
                    .filter(user::id.eq(contextual_user.id)),
            ))
            .get_result(&context.connection.get().unwrap())
            {
                Ok(t) => t,
                Err(_) => return Err(server_error()),
            } {
                match diesel::delete(training_session::training_session)
                    .filter(training_session::id.eq(id))
                    .execute(&context.connection.get().unwrap())
                {
                    Ok(_) => {
                        return Ok(DeleteOperationSuccess {
                            message: "Sucessfully deleted that training session.".into(),
                        })
                    }
                    Err(_) => return Err(server_error()),
                };
            } else {
                return Err(permission_error(Some(
                    "You don't have permission to do that.".into(),
                )));
            }
        } else {
            return Err(not_logged_in_permission_error());
        }
    }
    fn set_training_session_attendance(
        context: &Context,
        session_id: i32,
        attending: bool,
    ) -> FieldResult<TrainingSessionAttendance> {
        use data::schema::club::dsl as club;
        use data::schema::training_session::dsl as training_session;
        use data::schema::training_session_attendance::dsl as training_session_attendance;
        use diesel::prelude::*;

        if let Some(contextual_user) = &context.user {
            let training_session_id = match training_session::training_session
                .filter(training_session::id.eq(session_id))
                .select(training_session::id)
                .first::<i32>(&context.connection.get().unwrap())
            {
                Ok(t) => t,
                Err(_) => {
                    return Err(server_error());
                }
            };
            if match diesel::dsl::select(diesel::dsl::exists(
                training_session_attendance::training_session_attendance
                    .filter(training_session_attendance::user_id.eq(contextual_user.id))
                    .filter(training_session_attendance::training_session_id.eq(session_id)),
            ))
            .get_result(&context.connection.get().unwrap())
            {
                Ok(t) => t,
                Err(_) => return Err(server_error()),
            } {
                match diesel::update(training_session_attendance::training_session_attendance)
                    .set(training_session_attendance::attending.eq(attending))
                    .filter(
                        training_session_attendance::training_session_id.eq(training_session_id),
                    )
                    .filter(training_session_attendance::user_id.eq(contextual_user.id))
                    .get_result::<data::TrainingSessionAttendance>(
                        &context.connection.get().unwrap(),
                    ) {
                    Ok(training_session) => Ok(TrainingSessionAttendance {
                        id: training_session.id,
                        training_session: match training_session::training_session
                            .find(training_session.training_session_id)
                            .inner_join(club::club)
                            .select((
                                data::schema::training_session::all_columns,
                                data::schema::club::all_columns,
                            ))
                            .first::<(data::TrainingSession, data::Club)>(
                                &context.connection.get().unwrap(),
                            ) {
                            Ok((session, club)) => TrainingSession {
                                id: session.id,
                                start_time: session.start_time,
                                end_time: session.end_time,
                                livestream: session.livestream,
                                description: session.description,
                                club: Club {
                                    id: club.id,
                                    name: club.name,
                                    registered_school: club.registered_school,
                                    school_verified: club.school_verified,
                                    created: club.created,
                                    join_code: club.join_code,
                                },
                            },
                            Err(_) => return Err(server_error()),
                        },
                        user: User {
                            id: contextual_user.id,
                            name: contextual_user.name.clone(),
                            created: contextual_user.created,
                            email: contextual_user.email.clone(),
                            email_verified: contextual_user.email_verified,
                        },
                        attending,
                    }),
                    Err(_) => Err(server_error()),
                }
            } else {
                match diesel::insert_into(training_session_attendance::training_session_attendance)
                    .values(data::NewTrainingSessionAttendance {
                        training_session_id: training_session_id,
                        user_id: contextual_user.id,
                        attending,
                    })
                    .returning(data::schema::training_session_attendance::all_columns)
                    .get_result::<data::TrainingSessionAttendance>(
                        &context.connection.get().unwrap(),
                    ) {
                    Ok(_) => Ok(TrainingSessionAttendance {
                        id: training_session_id,
                        training_session: match training_session::training_session
                            .find(training_session_id)
                            .inner_join(club::club)
                            .select((
                                data::schema::training_session::all_columns,
                                data::schema::club::all_columns,
                            ))
                            .first::<(data::TrainingSession, data::Club)>(
                                &context.connection.get().unwrap(),
                            ) {
                            Ok((session, club)) => TrainingSession {
                                id: session.id,
                                start_time: session.start_time,
                                end_time: session.end_time,
                                livestream: session.livestream,
                                description: session.description,
                                club: Club {
                                    id: club.id,
                                    name: club.name,
                                    registered_school: club.registered_school,
                                    school_verified: club.school_verified,
                                    created: club.created,
                                    join_code: club.join_code,
                                },
                            },
                            Err(_) => return Err(server_error()),
                        },
                        user: User {
                            id: contextual_user.id,
                            name: contextual_user.name.clone(),
                            created: contextual_user.created,
                            email: contextual_user.email.clone(),
                            email_verified: contextual_user.email_verified,
                        },
                        attending,
                    }),
                    Err(_) => return Err(server_error()),
                }
            }
        } else {
            Err(server_error())
        }
    }
}
