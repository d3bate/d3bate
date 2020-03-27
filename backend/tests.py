import unittest
from datetime import datetime

from app import create_app
from flask import Flask

unittest.TestLoader.sortTestMethodsUsing = None


class E2E(unittest.TestCase):
    def setUp(self):
        self.app: Flask = create_app()
        self.client = self.app.test_client()
        self.token = None

    def test_application_end_to_end(self):
        create_user = self.client.post("/auth/register", json={
            "username": "teymour",
            "name": "Teymour Aldridge",
            "email": "me@teymour.tk",
            "password": "hello"
        }).json
        self.assertTrue(create_user["type"] == "success")

        create_existing_user = self.client.post("/auth/register", json={
            "username": "teymour",
            "name": "Teymour Aldridge",
            "email": "me@teymour.tk",
            "password": "hello"
        }).json
        self.assertTrue(create_existing_user["type"] == "error")

        token = self.client.post("/auth/login", json={
            "identifier": "me@teymour.tk",
            "password": "hello"
        }).json
        self.assertTrue(token["type"] == "data")
        self.token = token["data"]["token"]

        create_club = self.client.post("/api/club/create", json={
            "club_name": "Debating",
            "school_website": "https://teymour.tk"
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        })
        self.assertTrue(create_club.json["type"] == "data")

        get_club_list = self.client.get("/api/club/get_all",
                                        headers={"Authorization": "Bearer {}".format(self.token)}).json

        self.assertTrue(len(get_club_list["data"]) == 1)

        club_id = get_club_list["data"][0]

        start_time = datetime.utcnow().timestamp() + 900
        end_time = datetime.utcnow().timestamp() + 1200
        add_training_session_1 = self.client.post("/api/club/training/add", json={
            "club_id": club_id["id"],
            "livestream": False,
            "start_time": start_time,
            "end_time": end_time,
            "description": "Hello World!"
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        }).json

        self.assertTrue(add_training_session_1["type"] == "success+data")

        get_training_session_1 = self.client.get("/api/club/training/all", json={
            "club_id": club_id["id"]
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        }).json

        self.assertTrue(get_training_session_1["type"] == "data")
        training_session = get_training_session_1["data"][0]
        self.assertTrue(training_session["start_time"] == start_time)
        self.assertTrue(training_session["end_time"] == end_time)

        update_training_session_1 = self.client.post("/api/club/training/update", json={
            "session_id": training_session["id"],
            "delta": {
                "start_time": start_time + 10
            }
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        }).json
        self.assertTrue(update_training_session_1["type"] == "success")

        get_training_session_1_updated = self.client.get("/api/club/training/all", json={
            "club_id": club_id["id"]
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        }).json

        self.assertTrue(get_training_session_1_updated["type"] == "data")
        training_session_updated = get_training_session_1_updated["data"][0]
        self.assertTrue(training_session_updated["start_time"] == start_time + 10)
        self.assertTrue(training_session_updated["end_time"] == end_time)

        leave_club = self.client.post("/api/club/leave", json={"club_id": get_club_list["data"][0]["id"]},
                                      headers={
                                          "Authorization": "Bearer {}".format(self.token)
                                      }).json
        self.assertTrue(leave_club["type"] == "success")

        get_club_list_2 = self.client.get("/api/club/get_all",
                                          headers={"Authorization": "Bearer {}".format(self.token)}).json

        self.assertTrue(len(get_club_list_2["data"]) == 0)
