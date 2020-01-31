from flask import Flask
import os
from flask_login import LoginManager

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy

app = 0
db = SQLAlchemy()
migrate = Migrate(db)
login_manager = LoginManager()


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    db.init_app(app)
    migrate.init_app(migrate)
    login_manager.init_app(app)


if __name__ == '__main__':
    create_app().run()
