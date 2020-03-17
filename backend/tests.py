from app import create_app
from flask import Flask

import unittest


class E2E(unittest.TestCase):
    def setUp(self):
        self.app: Flask = create_app()
        self.client = self.app.test_client()
