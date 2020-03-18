from flask import Blueprint, request

club_blueprint = Blueprint("club", __name__, url_prefix="/api/club")


@club_blueprint.route("/create")
def create_club():
    club_name = request.json["club_name"]
