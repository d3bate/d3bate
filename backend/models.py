from datetime import datetime

from app import db
from werkzeug.security import generate_password_hash, check_password_hash

members = db.Table("club_members",
                   db.Column('club_id', db.Integer, db.ForeignKey("club.id"), primary_key=True),
                   db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True)
                   )

admins = db.Table("administrators",
                  db.Column('club_id', db.Integer, db.ForeignKey("club.id"), primary_key=True),
                  db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True)
                  )

owners = db.Table("club_owners",
                  db.Column('club_id', db.Integer, db.ForeignKey("club.id"), primary_key=True),
                  db.Column('user_id', db.Integer, db.ForeignKey("user.id"), primary_key=True)
                  )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, nullable=False)
    username = db.Column(db.Text, nullable=False)
    email = db.Column(db.Text, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    email_verified = db.Column(db.Boolean, default=False)

    club_ownerships = db.relationship("Club", secondary=members, lazy="subquery",
                                      backref=db.backref("owned_clubs", lazy=True))
    club_memberships = db.relationship("Club", secondary=members, lazy="subquery",
                                       backref=db.backref("member_clubs", lazy=True))
    club_adminships = db.relationship("Club", secondary=members, lazy="subquery",
                                      backref=db.backref("admin_clubs", lazy=True))

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
    owners = db.relationship("User", secondary=owners, lazy="subquery", backref=db.backref("owners", lazy=True))
    admins = db.relationship("User", secondary=members, lazy="subquery", backref=db.backref("admins", lazy=True))
    members = db.relationship("User", secondary=members, lazy="subquery", backref=db.backref("members", lazy=True))
    chat_messages = db.relationship("ChatMessageThread", backref="club_chat_messages", lazy=True)


class TrainingSession(db.Model):
    __tablename__ = "training_session"
    id = db.Column(db.Integer, primary_key=True)
    start_time = db.Column(db.DateTime)
    end_time = db.Column(db.DateTime)
    livestream = db.Column(db.Boolean, default=False)
    description = db.Column(db.Text)
    club = db.Column(db.Integer, db.ForeignKey("club.id"), nullable=False)


class TrainingSessionAttendance(db.Model):
    __tablename__ = "training_session_attendance"
    id = db.Column(db.Integer, primary_key=True)
    training_session_id = db.Column(db.Integer, db.ForeignKey("training_session.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    attending = db.Column(db.Boolean, nullable=False, default=False)


class ChatMessageThread(db.Model):
    __tablename__ = "chat_message_thread"
    id = db.Column(db.Integer, primary_key=True)
    start_message = db.Column(db.Integer, db.ForeignKey("chat_message.id"), nullable=False)
    last_active = db.Column(db.DateTime, nullable=False)
    user_count = db.Column(db.Integer, nullable=False)
    club_id = db.Column(db.Integer, db.ForeignKey("club.id"), nullable=False)
    club = db.relationship("Club", backref="message_thread_club", lazy=True)


class ChatMessage(db.Model):
    __tablename__ = "chat_message"
    id = db.Column(db.Integer, primary_key=True)
    is_reply = db.Column(db.Boolean)
    reply_to = db.Column(db.Integer, nullable=True)
    created = db.Column(db.DateTime, nullable=False)
