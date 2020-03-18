import os

from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt_manager = JWTManager()


def create_app() -> Flask:
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
    db.init_app(app)
    migrate.init_app(app, db)
    jwt_manager.init_app(app)
    from auth import auth_blueprint
    app.register_blueprint(auth_blueprint)
    return app


if __name__ == '__main__':
    create_app().run()
