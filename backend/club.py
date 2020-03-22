from datetime import datetime

from app import db
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Club, User, TrainingSession
from sqlalchemy import or_, and_

club_blueprint = Blueprint("club", __name__, url_prefix="/api/club")


def club_to_json(x):
    return {
        "name": x.name,
        "id": x.id,
        "registered_school": x.registered_school,
        "school_verified": x.school_verified,
        "member_count": len(x.members) + len(x.owners) + len(x.admins)
    }


@club_blueprint.route("/create", methods=("POST",))
@jwt_required
def create_club():
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])
    if not user:
        return jsonify({
            "type": "error",
            "message": "",
            "suggestion": ""
        })
    club_name = request.json["club_name"]
    registered_school = request.json["school_website"]
    existing_club = Club.query.filter(Club.name == club_name).first()
    if existing_club:
        return jsonify({
            "type": "error",
            "message": "There is already a club with that name.",
            "suggestion": ""
        })
    club = Club(name=club_name, registered_school=registered_school)
    club.owners.append(user)
    db.session.add(club)
    db.session.commit()
    db.session.refresh(club)
    return jsonify({
        "type": "data",
        "data": club_to_json(club)
    })


@club_blueprint.route("/get_all")
@jwt_required
def get_clubs():
    current_user = get_jwt_identity()
    return jsonify({
        "type": "data",
        "data": {
            "admin": list(
                map(lambda x: club_to_json(x), Club.query.filter((Club.admins.any(id=current_user["id"]))).all())),
            "member": list(
                map(lambda x: club_to_json(x), Club.query.filter((Club.members.any(id=current_user["id"]))).all())),
            "owner": list(
                map(lambda x: club_to_json(x), Club.query.filter((Club.owners.any(id=current_user["id"]))).all()))

        }
    })


@club_blueprint.route("/leave", methods=("POST",))
@jwt_required
def leave_club():
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])
    club_id = request.json["club_id"]
    club = Club.query.get(club_id)
    if not club:
        return jsonify({
            "type": "error",
            "message": "That club does not exist.",
            "suggestion": ""
        })
    try:
        club.owners.remove(user)
    except ValueError:
        pass
    try:
        club.members.remove(user)
    except ValueError:
        pass
    try:
        club.admins.remove(user)
    except ValueError:
        pass
    db.session.commit()
    return jsonify({
        "type": "success",
        "message": "You have been removed from that club.",
        "suggestion": ""
    })


@club_blueprint.route("/training/add", methods=("POST", "PUT"))
@jwt_required
def add_training_session():
    start_time = request.json["start_time"]
    end_time = request.json["end_time"]
    try:
        livestream = request.json["livestream"]
    except KeyError:
        livestream = False
    club_id = request.json["club_id"]
    if not isinstance(club_id, int):
        return jsonify({
            "type": "error",
            "message": "Club IDs must be of an integer datatype.",
            "suggestion": ""
        })
    club = Club.query.get(club_id)
    if not club:
        return jsonify({
            "type": "error",
            "message": "That club doesn't exist.",
            "suggestion": ""
        })
    training_session = TrainingSession(
        start_time=datetime.utcfromtimestamp(start_time),
        end_time=datetime.utcfromtimestamp(end_time),
        livestream=livestream,
        club=club_id
    )
    db.session.add(training_session)
    db.session.commit()
    db.session.refresh(training_session)
    return jsonify({
        "type": "success+data",
        "message": "The training session was successfully scheduled.",
        "suggestion": "",
        "data": training_session_to_json(training_session)
    })


@club_blueprint.route("/training/remove")
@jwt_required
def remove_debating_session():
    current_user = get_jwt_identity()
    session_id = request.json["session_id"]
    club_id = request.json["club_id"]
    user_has_privileges = Club.query.get(
        and_(or_(Club.owners.any(id=current_user["id"]), Club.admins.any(id=current_user["id"])), Club.id.any(club_id)))
    if not user_has_privileges:
        return jsonify({
            "type": "error",
            "message": "You don't have permission to do that.",
            "suggestion": "Ask for permission."
        })
    training_session = TrainingSession.query.get(session_id)
    if not training_session:
        return jsonify({
            "type": "error",
            "message": "That session doesn't exist.",
            "suggestion": ""
        })
    db.session.delete(training_session)
    db.session.commit()
    return jsonify({
        "type": "success",
        "message": "Successfully deleted that post.",
        "suggestion": ""
    })


@club_blueprint.route("/training/update", methods=("POST",))
@jwt_required
def update_training():
    current_user = get_jwt_identity()
    session_id = request.json["session_id"]
    delta = request.json["delta"]
    training_session = TrainingSession.query.get(session_id)
    user_has_privileges = Club.query.filter(
        (Club.owners.any(id=current_user["id"]) | Club.admins.any(id=current_user["id"])) & (
                Club.id == training_session.club)).first()
    if not user_has_privileges:
        return jsonify({
            "type": "error",
            "message": "You don't have permission to do that.",
            "suggestion": "Ask for permission."
        })
    for (key, value) in delta.items():
        if key == "start_time":
            training_session.start_time = datetime.utcfromtimestamp(value)
        elif key == "end_time":
            training_session.end_time = datetime.utcfromtimestamp(value)
        elif key == "livestream":
            training_session.livestream = value
    db.session.commit()
    return jsonify({
        "type": "success",
        "message": "",
        "suggestion": ""
    })


def training_session_to_json(session):
    return {
        "id": session.id,
        "club_id": session.club,
        "start_time": session.start_time.timestamp(),
        "end_time": session.end_time.timestamp(),
        "livestream": session.livestream
    }


@club_blueprint.route("/training/single_club")
@jwt_required
def get_club_training_sessions():
    current_user = get_jwt_identity()
    club_id = request.json["club_id"]
    club = Club.query.filter(
        and_(or_(Club.owners.any(id=current_user["id"]),
                 or_(Club.admins.any(id=current_user["id"]), Club.members.any(id=current_user["id"]))),
             (Club.id == club_id))).first()
    if not club:
        return jsonify({
            "type": "error",
            "message": "Either that club does not exist, or you don't have permission to view it",
            "suggestion": ""
        })
    return jsonify({
        "type": "data",
        "data": list(map(lambda x: training_session_to_json(x), club.training_sessions))
    })


@club_blueprint.route("/training/all")
@jwt_required
def get_all_training_sessions():
    current_user = get_jwt_identity()
    clubs = Club.query.filter((Club.admins.any(id=current_user["id"])) | (
        Club.owners.any(id=current_user["id"])) | (Club.members.any(id=current_user["id"]))).all()
    training_sessions = TrainingSession.query.filter(or_(*[(TrainingSession.club == club.id) for club in clubs]))
    return jsonify({
        "type": "data",
        "data": list(map(lambda x: training_session_to_json(x), training_sessions))
    })
