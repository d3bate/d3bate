import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from websockets import socketio

migrate = Migrate()
jwt_manager = JWTManager()
session = Session()
mail = Mail()


def create_app() -> Flask:
    app = Flask(__name__)

    CORS(app)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SESSION_REDIS"] = os.environ.get("REDIS_URL")
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = "session-data"
    app.config["MAIL_DEFAULT_SENDER"] = "d3bate (do not reply) <bureaucrat@debating.web.app>" if not os.environ.get(
        "MAIL_SENDER") else os.environ.get("MAIL_SENDER")
    if os.environ.get("FLASK_ENV") != "development":
        app.config["MAIL_SERVER"] = os.environ.get("MAILGUN_SMTP_SERVER")
        app.config["MAIL_PORT"] = os.environ.get("MAILGUN_SMTP_PORT")
        app.config["MAIL_USERNAME"] = os.environ.get("MAILGUN_SMTP_LOGIN")
        app.config["MAIL_PASSWORD"] = os.environ.get("MAILGUN_SMTP_PASSWORD")

    db.init_app(app)
    session.init_app(app)
    migrate.init_app(app, db)
    jwt_manager.init_app(app)
    socketio.init_app(app)
    mail.init_app(app)

    from auth import auth_blueprint
    app.register_blueprint(auth_blueprint)
    from club import club_blueprint
    app.register_blueprint(club_blueprint)
    return app


if __name__ == "__main__":
    app = create_app()
    socketio.run(app)
