from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    username = db.Column(db.Text)
    email = db.Column(db.Text)
    password_hash = db.Column(db.Text)
    created = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    registered_school = db.Column(db.Text)
    school_verified = db.Column(db.Boolean, nullable=False, default=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    training_sessions = db.relationship("TrainingSession", backref="training_sessions", lazy=True)


members = db.Table("club_members",
                   db.Column('club_id', db.Integer, db.ForeignKey("club.id"), primary_key=True),
                   db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True)
                   )

admins = db.Table("administrators",
                  db.Column('club_id', db.Integer, db.ForeignKey("club.id"), primary_key=True),
                  db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True)
                  )


class TrainingSession(db.Model):
    __tablename__ = "training_session"
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    club = db.Column(db.Integer, db.ForeignKey("club.id"), nullable=False)


class TrainingSessionAttendance(db.Model):
    __tablename__ = "training_session_attendance"
    training_session_id = db.Column(db.Integer, db.ForeignKey("training_session.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    attending = db.Column(db.Boolean, nullable=False, default=False)
