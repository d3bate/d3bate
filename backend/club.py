from flask import Blueprint, request, jsonify
from sqlalchemy import and_, or_
from app import db
from models import Club
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


@club_blueprint.route("/club/get_list")
@jwt_required
def get_clubs(club_id):
    pass


@club_blueprint.route("/club/<club_id>")
@jwt_required
def get_info(club_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user["id"])
    club = Club.query.filter(
        or_((Club.admins.any(user.id), or_(Club.owners.any(user.id), Club.members.any(user.id))))
    )
    if not club:
        return jsonify({
            "type": "error",
            "message": "That club doesn't exist, or you don't have permission to view it.",
            "suggestion": ""
        })
    return jsonify({
        "type": "data",
        "data": {
            "members": len(club.members) + len(club.owners) + len(club.admins),
            "name": club.name,
            "created": club.created,
            "registered_school": club.registered_school,
            "school_verified": club.school_verified
        }
    })
