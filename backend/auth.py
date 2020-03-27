import json
import os

import requests
from flask import Blueprint, request, jsonify, session, render_template, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import or_

from app import db
from models import User

auth_blueprint = Blueprint("auth", __name__, url_prefix="/auth", template_folder="templates")


def send_mail(to, subject, html, text, from_email="bureaucrat@debating.web.app",
              api_key=os.environ.get("SENDGRID_API_KEY")):
    return requests.request(data=json.dumps({
        "personalizations": [
            {
                "to": [{"email": to}] if isinstance(to, str) else [{"email": email} for email in to]
            },
        ],
        "subject": subject,
        "from": {
            "email": from_email
        },
        "content": [
            {
                "type": "text/plain",
                "value": text
            },
            {
                "type": "text/html",
                "value": html
            }
        ]
    }), method="POST", url="https://api.sendgrid.com/v3/mail/send",
        headers={"Authorization": "Bearer {}".format(api_key), "Content-Type": "application/json"})


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
    print(os.environ.get("TESTING"))
    if not os.environ.get("TESTING"):
        if not user.email_verified:
            return jsonify({
                "type": "error",
                "message": "You have not verified your email",
                "suggestion": "Check your inbox, verify your email and then try again."
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
    db.session.refresh(user)
    jwt_token = create_access_token({"id": user.id, "email_confirmation": True})

    if not os.environ.get("TESTING"):
        html = render_template("email_confirmation.html",
                               confirmation_url="https://d3bate.herokuapp.com/auth/confirm?token={}"
                               .format(jwt_token))
        send_mail(user.email, "[d3bate] email verification", html,
                  "Please copy the following URL and paste it into your browser: {}".format(jwt_token))

    return jsonify({
        "type": "success",
        "message": "Your account has been created.",
        "suggestion": ""
    })


@auth_blueprint.route("/confirm")
@jwt_required
def confirm_email():
    token = get_jwt_identity()
    if "email_confirmation" in token:
        if token["email_confirmation"] is True:
            user = User.query.get(token["id"])
            user.email_verified = True
            db.session.commit()
            return render_template("confirm_verification.html", redirect_url=current_app.config["FRONTEND_URL"])
    else:
        return render_template("confirm_failure.html", application_url=current_app.config["FRONTEND_URL"])


@auth_blueprint.route("/ws_login")
def ws_login():
    identifier = request.json["identifier"]
    password = request.json["password"]
    user = User.query.filter(or_((User.username == identifier) | (User.email == identifier))).first()
    if not user:
        return jsonify({
            "type": "error",
            "message": "That user does not exist.",
            "suggestion": ""
        })
    if user.check_password(password):
        session["user"] = user
        return jsonify({
            "type": "success",
            "message": "Successfully logged you in.",
            "suggestion": ""
        })
    return jsonify({
        "type": "error",
        "message": "Your password is incorrect.",
        "suggestion": "Please try again."
    })
