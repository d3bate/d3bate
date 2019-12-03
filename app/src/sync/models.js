import {action, decorate, observable} from "mobx";
import {auth, firebase, Collection} from "../sync";

class User {
    userObject = null;

    setUser(user) {
        this.userObject = user
    }
}

decorate(User, {
    userObject: observable,
    setUser: action
});

export const user = new User();

auth.onAuthStateChanged(uObject => {
    user.setUser(uObject);
});

