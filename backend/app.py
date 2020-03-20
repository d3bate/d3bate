import os

from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_session import Session
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
from websockets import socketio

migrate = Migrate()
jwt_manager = JWTManager()
session = Session()


def create_app() -> Flask:
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    app.config["SESSION_REDIS"] = os.environ.get("REDIS_URL")
    app.config["SESSION_TYPE"] = "filesystem"
    app.config["SESSION_FILE_DIR"] = "session-data"

    db.init_app(app)
    session.init_app(app)
    migrate.init_app(app, db)
    jwt_manager.init_app(app)
    socketio.init_app(app)

    from auth import auth_blueprint
    app.register_blueprint(auth_blueprint)
    from club import club_blueprint
    app.register_blueprint(club_blueprint)
    return app
