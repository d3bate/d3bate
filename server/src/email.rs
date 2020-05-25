/// Used to send an email.
///
/// Currently sends emails via sendgrid.com
pub struct Email<'a> {
    to: Vec<&'a str>,
    subject: &'a str,
    from: &'a str,
    html_content: Option<&'a str>,
    text_content: Option<&'a str>,
}

impl<'a> Email<'a> {
    /// Constructs a new email to be sent.
    ///
    /// Note that no validation of the supplied data is performed.
    pub fn new(
        to: Vec<&'a str>,
        subject: &'a str,
        from: &'a str,
        html_content: Option<&'a str>,
        text_content: Option<&'a str>,
    ) -> Self {
        Self {
            to,
            subject,
            from,
            html_content,
            text_content,
        }
    }
    /// Constructs an email message for later sending.
    fn build_message(&self) -> String {
        format!(
            "\
        {{\"personalizations\": [\
            {{\
                \"to\": [{}]\
            }}],\
            \"subject\": \"{}\",\
            \"from\": {{\"email\": \"{}\"}},\
            \"content\": [\
                {{\"type\": \"text/plain\", \"value\": \"{}\"}},\
                {{\"type\": \"text/plain\", \"value\": \"{}\"}}\
            ]\
        }}\
        ",
            self.to
                .iter()
                .map(|address| format!("{{\"email\": \"{}\"}}", address))
                .collect::<String>(),
            self.subject,
            self.from,
            self.text_content.unwrap_or(
                "This message isn't available in a raw text format, \
             and your mail client doesn't support HTML. Try using a different mail client to \
             read this."
            ),
            self.html_content.unwrap_or("This message has no content.")
        )
    }
    /// Sends a message using sendgrid.com's API.
    pub async fn send(&self) {
        match reqwest::Client::new()
            .post("https://api.sendgrid.com/v3/mail/send")
            .header(
                "Authorization",
                format!("Bearer {}", std::env::var("SENDGRID_API_KEY").unwrap()),
            )
            .header("Content-Type", "application/json")
            .body(self.build_message())
            .send()
            .await
        {
            Ok(_) => {}
            Err(_) => {}
        };
    }
}

#[cfg(test)]
mod tests {
    use super::Email;
    #[test]
    fn test_message_building() {
        let message = Email::new(
            vec!["test@debating.web.app"],
            "Hello World",
            "test@debating.web.app",
            Some("<h1>Hello World!</h1>"),
            Some("Hello World!"),
        );
        assert_eq!(message.build_message(), "{\"personalizations\": [{\"to\": [{\"email\": \"test@debating.web.app\"}]}],\"subject\": \"Hello World\",\"from\": {\"email\": \"test@debating.web.app\"},\"content\": [{\"type\": \"text/plain\", \"value\": \"Hello World!\"},{\"type\": \"text/plain\", \"value\": \"<h1>Hello World!</h1>\"}]}");
    }
}
