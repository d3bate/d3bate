#!/usr/bin/env bash
source venv/bin/activate
export SECRET_KEY=tewhjknfd2@r3wejkfnggdmnsr3t4jreth-3r0ew-fds0-+FSDgodjknb
export DATABASE_URL=sqlite:///test.db
export FLASK_ENV=development
export TESTING=true
flask db upgrade
python app.py
