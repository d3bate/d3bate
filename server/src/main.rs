extern crate log;
mod graphql;

#[tokio::main]
async fn main() {
    use warp::Filter;
    ::std::env::set_var("RUST_LOG", "warp_server");
    env_logger::init();
    let log = warp::log("warp_server");
    let index = warp::path::end().map(|| {
        warp::http::Response::builder()
            .header("content-type", "text/html")
            .body("<html><head></head><body><h1>d3bate</h1></body></html>")
    });
    let port: u32 = std::env::var("PORT")
        .unwrap_or("8080".to_string())
        .parse::<u32>()
        .unwrap();
    log::info!("Listening on 127.0.0.1:{}", port);
    let database_url = match std::env::var("DATABASE_URL") {
        Ok(s) => s,
        Err(_) => {
            log::warn!(
                "The database url was not specified. Using default value `postgres://localhost`."
            );
            "postgres://localhost".to_string()
        }
    };
    let state = warp::any().map(
        move || -> diesel::r2d2::ConnectionManager<diesel::PgConnection> {
            diesel::r2d2::ConnectionManager::new(database_url.clone())
        },
    );
    warp::serve(warp::get().and(index))
        .run(([127, 0, 0, 1], 8080))
        .await
}
