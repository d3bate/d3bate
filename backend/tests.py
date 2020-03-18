from app import create_app
from flask import Flask

import unittest

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
            "name": "Debating",
            "school_website": "https://teymour.tk"
        }, headers={
            "Authorization": "Bearer {}".format(self.token)
        })
        self.assertTrue(create_club.json["type"] == "success")
