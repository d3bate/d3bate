from ..app import login_manager


@login_manager.user_loader
def get_user(uid):
    from ..db import User
    return User.get(uid)
