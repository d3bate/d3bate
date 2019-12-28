import {decorate, observable, action} from "mobx"
import {firebase} from "../index";
import {findItem} from "./finditem";

class ClubUsers {
    users = [];

    updateUser(user) {
        let foundUser = findItem(user, this.users);
        if (foundUser !== -1) {
            this.users[foundUser] = user
        } else {
            this.users.push(user)
        }
    }
}

decorate(ClubUsers, {
    users: observable,
    updateUser: action
});

export const clubUsers = new ClubUsers();

