import functools

from flask import session
from flask_socketio import SocketIO, ConnectionRefusedError, join_room, send, rooms
from models import TrainingSession
from sqlalchemy import and_, or_

socketio = SocketIO()


@functools.wraps
def ws_auth(f):
    def wrapper(data, *args, **kwargs):
        if not session["user"]:
            return {
                "type": "error",
                "message": "",
                "suggestion": ""
            }
        return f(data, *args, **kwargs)

    return wrapper


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
    join_room("{}".format(training_session.id))
    send({
        "type": "user_joined",
        "data": {
            "id": session["user"].id,
            "name": session["user"].name
        }
    })


@socketio.on("send/audio")
@ws_auth
def receive_stream(data):
    audio = data["data"]
    user_room = next(filter(lambda x: x.isnumeric(), rooms()))
    if user_room:
        send({
            "type": "incoming_audio",
            "data": {
                "user": {
                    "id": session["user"].id,
                    "name": session["user"].name
                },
                "audio": audio
            }
        }, room=user_room)
    else:
        return {
            "type": "error",
            "message": "You are not in any livestreams.",
            "suggestion": "Join one.",
        }


@socketio.on("send/video")
@ws_auth
def receive_stream(data):
    video = data["video"]
    user_room = next(filter(lambda x: x.isnumeric(), rooms()))
    if user_room:
        send({
            "type": "incoming_video",
            "data": {
                "user": {
                    "id": session["user"].id,
                    "name": session["user"].name
                },
                "video": video
            }
        }, room=user_room)
    else:
        return {
            "type": "error",
            "message": "You are not in any livestreams.",
            "suggestion": "Join one.",
        }
