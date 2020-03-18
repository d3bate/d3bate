from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from models import User
from flask_jwt_extended import create_access_token
from app import db

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth")


@auth_blueprint.route("/login", methods=("POST",))
def login():
    identifier = request.json["identifier"]
    password = request.json["password"]
    user = User.query.filter(or_((User.email == identifier), (User.username == identifier))).first()
    if not user:
        return jsonify({
            "type": "error",
            "message": "That user does not exist.",
            "suggestion": ""
        })
    if not user.check_password(password):
        return jsonify({
            "type": "error",
            "message": "The password for that user is incorrect.",
            "suggestion": ""
        })
    token = create_access_token({"id": user.id, "email": user.email, "name": user.name, "username": user.username,
                                 "created": user.created})
    return jsonify({
        "type": "data",
        "data": {"token": token}
    })


@auth_blueprint.route("/register", methods=("POST",))
def register():
    username = request.json["username"]
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    existing_user = User.query.filter(or_((User.username == username), (User.email == email))).first()
    if existing_user:
        return jsonify({
            "type": "error",
            "message": "That user already exists.",
            "suggestion": ""
        })
    user = User(username=username, name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({
        "type": "success",
        "message": "Your account has been created.",
        "suggestion": ""
    })
