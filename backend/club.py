from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from app import db
from models import Club, User
from flask_jwt_extended import jwt_required, get_jwt_identity

club_blueprint = Blueprint("club", __name__, url_prefix="/api/club")


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
    return jsonify({
        "type": "success",
        "message": "Created that club.",
        "suggestion": ""
    })


def club_to_json(x):
    return {
        "name": x.name,
        "id": x.id,
        "registered_school": x.registered_school,
        "school_verified": x.school_verified,
        "member_count": len(x.members) + len(x.owners) + len(x.admins)
    }


@club_blueprint.route("/get_list")
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
