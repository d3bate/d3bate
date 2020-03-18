#!/usr/bin/env bash
. venv/bin/activate
export FLASK_APP=app:create_app
export DATABASE_URL=sqlite:///test.db
export SECRET_KEY=afghrbej3424thnr1452@lafd2t.ewgrf4t4njhnr-gsfdjknbmv
flask db upgrade
python -m unittest tests.py
rm -rf test.db