//! Integration tests for the GraphQL API.

#[test]
fn test_e2e() {
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

    let context1 = crate::graphql::Context {
        user: None,
        connection: actix_web::web::Data::new(pool),
    };
    let schema = crate::graphql::schema();
    let vars = juniper::Variables::default();
    let result = futures::executor::block_on(juniper::execute(
        "mutation {
            registerUser(newUser: {
              name:\"Test User\",
              email:\"test@debating.web.app\",
              pgp: \"he/they\",
              password: \"none\"
            }) {
              name
            }
          }",
        None,
        &schema,
        &vars,
        &context1,
    )).unwrap();
    match result.0 {
        juniper::Value::Object(o) => {
            let register_user = o.get_field_value("registerUser").unwrap();
            let name = match register_user {
                juniper::Value::Object(n) => {
                    match n.get_field_value("name").unwrap() {
                        juniper::Value::Scalar(d) => {
                            match d {
                                juniper::DefaultScalarValue::String(s) => {
                                    assert_eq!(s, "Test User")
                                } 
                                _ => panic!()
                            }
                        }
                        _ => panic!("")
                    }
                }
                _ => panic!("")
            };
        }
        _ => {
            panic!("Invalid return type for registering of user.")
        }
    }
}
