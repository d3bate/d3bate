use askama::Template;

#[derive(Template)]
#[template(path = "confirm_email.html")]
pub struct ConfirmEmailTemplate<'a> {
    confirm_url: &'a str,
}

impl<'a> ConfirmEmailTemplate<'a> {
    pub fn new(u: &'a str) -> Self {
        Self { confirm_url: u }
    }
}
