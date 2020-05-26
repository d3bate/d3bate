//! Integration tests for the GraphQL API.

#[actix_rt::test]
async fn test_e2e() {
    use diesel::prelude::*;

    let pool: crate::Pool = diesel::r2d2::Pool::new(diesel::r2d2::ConnectionManager::new(
        std::env::var("DATABASE_URL")
            .unwrap_or("postgres://postgres:postgres@localhost/postgres".into()),
    ))
    .unwrap();

    use data::schema::user::dsl as user;
    diesel::delete(user::user)
        .execute(&pool.get().unwrap())
        .unwrap();

    let mut app = actix_web::test::init_service(
        actix_web::App::new()
            .data(pool.clone())
            .service(crate::auth::confirm_email),
    )
    .await;

    let context1 = crate::graphql::Context {
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
              pgp: \"he/they\",
              password: \"none\"
            }) {
              name, id
            }
          }",
        None,
        &schema,
        &vars,
        &context1,
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

    let context2 = crate::graphql::Context {
        user: Some(match user::user.find(user_id).first(&pool.get().unwrap()) {
            Ok(u) => u,
            Err(_) => panic!(),
        }),
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
        &context2,
    )
    .await
    .unwrap();

    match user::user
        .find(user_id)
        .first::<data::User>(&context2.connection.get().unwrap())
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
}
