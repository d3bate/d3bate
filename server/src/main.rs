#[macro_use]
extern crate juniper;
extern crate jsonwebtoken as jwt;

mod auth;
mod graphql;
#[cfg(test)]
mod tests;

pub type Pool = diesel::r2d2::Pool<diesel::r2d2::ConnectionManager<diesel::PgConnection>>;

async fn graphiql_route() -> Result<actix_web::HttpResponse, actix_web::error::Error> {
    juniper_actix::graphiql_handler("/api", None).await
}

async fn playground_route() -> Result<actix_web::HttpResponse, actix_web::error::Error> {
    juniper_actix::playground_handler("/api", None).await
}

async fn graphql_route(
    req: actix_web::HttpRequest,
    payload: actix_web::web::Payload,
    schema: actix_web::web::Data<graphql::Schema>,
    pool: actix_web::web::Data<Pool>,
    claims: Option<crate::auth::Claims>,
) -> Result<actix_web::HttpResponse, actix_web::Error> {
    use data::schema::user::dsl as user;
    use diesel::prelude::*;
    let context = graphql::Context {
        user: match claims {
            Some(c) => {
                match user::user
                    .filter(user::id.eq(c.id))
                    .first::<data::User>(&pool.get().unwrap())
                {
                    Ok(u) => Some(u),
                    Err(_) => None,
                }
            }
            None => None,
        },
        connection: pool,
    };
    juniper_actix::graphql_handler(&schema, &context, req, payload).await
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    let port: u32 = std::env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse::<u32>()
        .unwrap();
    let server = actix_web::HttpServer::new(move || {
        let database_url = match std::env::var("DATABASE_URL") {
            Ok(s) => s,
            Err(_) => {
                println!(
                    "The database url was not specified. Using default value `postgres://localhost`."
                );
                "postgres://localhost".to_string()
            }
        };
        let pool: Pool =
            diesel::r2d2::Pool::new(diesel::r2d2::ConnectionManager::new(database_url)).unwrap();
        actix_web::App::new()
            .data(pool)
            .data(graphql::schema())
            .service(
                actix_web::web::resource("/api")
                    .route(actix_web::web::post().to(graphql_route))
                    .route(actix_web::web::get().to(graphql_route)),
            )
            .service(
                actix_web::web::resource("/data-explorer")
                    .route(actix_web::web::get().to(graphiql_route)),
            )
            .service(
                actix_web::web::resource("/playground")
                    .route(actix_web::web::get().to(playground_route)),
            )
    });
    server.bind(format!("127.0.0.1:{}", port))?.run().await
}
