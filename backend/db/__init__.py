from ..app import db

memberships = db.Table('club_memberships',
                       db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
                       db.Column('club_id', db.Integer, db.ForeignKey('debatingclub.id'), primary_key=True),
                       db.Column('role', db.Integer, nullable=False)
                       )


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    password_hash = db.Column(db.String)
    email = db.Column(db.String)
    profile_url = db.Column(db.String)
    attendance = db.relationship('Attendance', backref='user', lazy=True)


class DebatingClub(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
    users = db.relationship('User', secondary=memberships, lazy='subquery', backref=db.backref('user', lazy=True))
    attendance = db.relationship('Attendance', backref='debatingclub', lazy=True)


class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    debating_club = db.Column(db.Integer, db.ForeignKey('debatingclub.id'), nullable=False)


class JudgeTeam(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    speaker_1 = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    debate_id = db.Column(db.Integer, db.ForeignKey('judge.id'), nullable=False)


class Judge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    debating_club = db.Column(db.Integer, db.ForeignKey('debatingclub.id'), nullable=False)
