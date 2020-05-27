//! Integration tests for the GraphQL API.

#[actix_rt::test]
async fn test_e2e() {
    use diesel::prelude::*;

    let pool: crate::Pool = diesel::r2d2::Pool::new(diesel::r2d2::ConnectionManager::new(
        std::env::var("DATABASE_URL")
            .unwrap_or("postgres://postgres:postgres@localhost/postgres".into()),
    ))
    .unwrap();

    use data::schema::club::dsl as club;
    use data::schema::club_member::dsl as club_member;
    use data::schema::training_session::dsl as training_session;
    use data::schema::user::dsl as user;
    diesel::delete(user::user)
        .execute(&pool.get().unwrap())
        .unwrap();
    diesel::delete(club::club)
        .execute(&pool.get().unwrap())
        .unwrap();
    diesel::delete(training_session::training_session)
        .execute(&pool.get().unwrap())
        .unwrap();
    diesel::delete(club_member::club_member)
        .execute(&pool.get().unwrap())
        .unwrap();

    let mut app = actix_web::test::init_service(
        actix_web::App::new()
            .data(pool.clone())
            .service(crate::auth::confirm_email),
    )
    .await;

    let context_unauthenticated = crate::graphql::Context {
        user: None,
        connection: actix_web::web::Data::new(pool.clone()),
    };
    let schema = crate::graphql::schema();
    let vars = juniper::Variables::default();
    let result = juniper::execute(
        "mutation {
            registerUser(newUser: {
              name:\"Test User\",
              email:\"test@debating.web.app\",
              pgp: \"name only\",
              password: \"none\"
            }) {
              name, id
            }
          }",
        None,
        &schema,
        &vars,
        &context_unauthenticated,
    )
    .await
    .unwrap();
    let user_id = *match &result.0 {
        juniper::Value::Object(o) => {
            let register_user = o.get_field_value("registerUser").unwrap();
            match register_user {
                juniper::Value::Object(n) => match n.get_field_value("id").unwrap() {
                    juniper::Value::Scalar(d) => match d {
                        juniper::DefaultScalarValue::Int(s) => s,
                        _ => panic!(),
                    },
                    _ => panic!(""),
                },
                _ => panic!(""),
            }
        }
        _ => panic!("Invalid return type for registering of user."),
    };

    let email_token = jwt::encode(
        &jwt::Header::default(),
        &crate::auth::Claims::new(user_id, None, crate::auth::ClaimsType::EmailVerify),
        &jwt::EncodingKey::from_secret("secret".as_bytes()),
    )
    .unwrap();
    let verify_email_req = actix_web::test::TestRequest::get()
        .uri(&format!("/auth/verify/{}", email_token))
        .to_request();
    let verify_email_resp = actix_web::test::call_service(&mut app, verify_email_req).await;
    assert_eq!(verify_email_resp.status(), actix_web::http::StatusCode::OK);

    match user::user
        .find(user_id)
        .first::<data::User>(&pool.get().unwrap())
    {
        Ok(found_user) => {
            assert_eq!(found_user.email_verified, true);
        }
        Err(_) => panic!(),
    };

    let invalid_email_token = jwt::encode(
        &jwt::Header::default(),
        &crate::auth::Claims::new(user_id, None, crate::auth::ClaimsType::EmailVerify),
        &jwt::EncodingKey::from_secret("invalid_secret".as_bytes()),
    )
    .unwrap();
    let invalid_email_req = actix_web::test::TestRequest::get()
        .uri(&format!("/auth/verify/{}", invalid_email_token))
        .to_request();
    let invalid_email_resp = actix_web::test::call_service(&mut app, invalid_email_req).await;
    assert_eq!(
        invalid_email_resp.status(),
        actix_web::http::StatusCode::BAD_REQUEST
    );

    let authenticated_owner_id: i32;
    let context_authenticated_owner = crate::graphql::Context {
        user: Some(
            match user::user
                .find(user_id)
                .first::<data::User>(&pool.get().unwrap())
            {
                Ok(u) => {
                    authenticated_owner_id = u.id;
                    u
                }
                Err(_) => panic!(),
            },
        ),
        connection: actix_web::web::Data::new(pool.clone()),
    };

    juniper::execute(
        "mutation {
            registerUser(newUser: {
              name:\"Test Admin\",
              email:\"test_admin@debating.web.app\",
              pgp: \"she/they\",
              password: \"none\"
            }) {
              name, id
            }
          }",
        None,
        &schema,
        &vars,
        &context_unauthenticated,
    )
    .await
    .unwrap();

    let context_authenticated_administrator_id: i32;
    let context_authenticated_administrator = crate::graphql::Context {
        user: Some(
            match user::user
                .filter(user::name.eq("Test Admin"))
                .first::<data::User>(&context_unauthenticated.connection.get().unwrap())
            {
                Ok(u) => {
                    context_authenticated_administrator_id = u.id;
                    u
                }
                Err(_) => panic!("Couldn't find the administrator context."),
            },
        ),
        connection: actix_web::web::Data::new(pool),
    };

    juniper::execute(
        "mutation {
        updatePassword(oldPassword:\"none\", newPassword: \"none2\") {name}
      }
      ",
        None,
        &schema,
        &vars,
        &context_authenticated_owner,
    )
    .await
    .unwrap();

    match user::user
        .find(user_id)
        .first::<data::User>(&context_authenticated_owner.connection.get().unwrap())
    {
        Ok(found_user) => {
            use bcrypt::verify;
            match verify("none2", &found_user.password_hash) {
                Ok(verified) => assert_eq!(verified, true),
                Err(e) => panic!("{:?}", e),
            }
        }
        Err(_) => panic!(),
    };

    juniper::execute(
        "mutation {
            createClub(club: {
              name: \"Test Club\",
              schoolWebsite: \"https://debating.web.app\"
            }) {
              name
            }
          }
      ",
        None,
        &schema,
        &vars,
        &context_authenticated_owner,
    )
    .await
    .unwrap();
    let (created_club_id, created_club_join_code): (i32, String) = match club::club
        .filter(club::name.eq("Test Club"))
        .first::<data::Club>(&context_unauthenticated.connection.get().unwrap())
    {
        Ok(new_club) => {
            assert_eq!(new_club.name, "Test Club");
            assert_eq!(new_club.registered_school, "https://debating.web.app");
            assert_eq!(
                new_club.join_code,
                base64::encode(
                    bcrypt::hash("Test Club", bcrypt::DEFAULT_COST)
                        .unwrap()
                        .get(0..6)
                        .unwrap()
                )
                .as_str()
            );
            (new_club.id, new_club.join_code)
        }
        Err(_) => panic!("Could not create club!"),
    };

    match club_member::club_member
        .filter(club_member::user_id.eq(authenticated_owner_id))
        .first::<data::ClubMember>(&context_authenticated_owner.connection.get().unwrap())
    {
        Ok(membership) => {
            assert_eq!(membership.club_id, created_club_id);
        }
        Err(_) => panic!("Not a club member."),
    }

    juniper::execute(
        &format!(
            "mutation {{
            joinClub(joinCode: \"{}\") {{
              id
            }}
          }}
          ",
            &created_club_join_code
        ),
        None,
        &schema,
        &vars,
        &context_authenticated_administrator,
    )
    .await
    .unwrap();

    match club_member::club_member
        .filter(club_member::user_id.eq(context_authenticated_administrator_id))
        .first::<data::ClubMember>(
            &context_authenticated_administrator
                .connection
                .get()
                .unwrap(),
        ) {
        Ok(cm) => {
            assert_eq!(cm.club_id, created_club_id);
        }
        Err(_) => panic!("Not in the club."),
    };

    juniper::execute(
        &format!(
            "mutation {{
            addTrainingSession(trainingSession: {{
              startTime: 1577894400,
              endTime: 1577901600,
              livestream: false,
              description: \"Test Session\",
              clubId: {}
            }}) {{id}}
          }}",
            created_club_id
        ),
        None,
        &schema,
        &vars,
        &context_authenticated_owner,
    )
    .await
    .unwrap();
    match training_session::training_session
        .filter(training_session::club_id.eq(created_club_id))
        .first::<data::TrainingSession>(&context_unauthenticated.connection.get().unwrap())
    {
        Ok(sess) => {
            assert_eq!(sess.description, "Test Session");
        }
        Err(_) => panic!("Could not get the training session from the database."),
    };

    juniper::execute(
        &format!(
            "mutation {{
                leaveClub(clubId: {}) {{
                  message
                }}
              }}",
            created_club_id
        ),
        None,
        &schema,
        &vars,
        &context_authenticated_administrator,
    )
    .await
    .unwrap();

    match club_member::club_member
        .filter(club_member::user_id.eq(context_authenticated_administrator_id))
        .first::<data::ClubMember>(
            &context_authenticated_administrator
                .connection
                .get()
                .unwrap(),
        ) {
        Ok(_) => panic!("Should not still be in the club."),
        Err(e) => match e {
            diesel::result::Error::NotFound => {}
            _ => panic!("Wrong kind of error."),
        },
    }
}
