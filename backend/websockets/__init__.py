from flask import session
from flask_socketio import SocketIO, ConnectionRefusedError, join_room, send
from models import TrainingSession
from sqlalchemy import and_, or_

socketio = SocketIO()


@socketio.on("connect")
def connect():
    if not session["user"]:
        return ConnectionRefusedError("You are not authenticated.")


@socketio.on("join")
def on_join(data):
    training_session_id = data["session_id"]
    training_session = TrainingSession.query.filter(and_((TrainingSession.id == training_session_id), or_(
        or_(TrainingSession.club.members.any(id=session["user"].id),
            TrainingSession.club.admins.any(id=session["user"].id)),
        TrainingSession.club.owners.any(id=session["user"].id)
    )))
    if not training_session:
        return {
            "type": "error",
            "message": "That training session cannot be found.",
            "suggestion": "Has it been deleted?"
        }
    if not training_session.livestream:
        return {
            "type": "error",
            "message": "Livestreams have not been enabled for this session.",
            "suggestion": ""
        }
    join_room("/training_session/{}".format(training_session.id))
    send({
        "type": "user_joined",
        "data": {
            "id": session["user"].id,
            "name": session["user"].name
        }
    })
