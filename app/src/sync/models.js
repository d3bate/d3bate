import {action, decorate, observable, observe} from "mobx";
import {auth, firebase} from "../sync";
import {persist} from 'mobx-persist';


class AppState {
    user = null;
    userDocument = null;

    setUser(user) {
        this.user = user
    }

    setUserDocument(document) {
        this.userDocument = document
    }
}

decorate(AppState, {
    user: [persist("object"), observable],
    userDocument: [persist("object"), observable],
    setUser: action,
    setUserDocument: action,
});

export const appState = new AppState();


auth.onAuthStateChanged(uObject => {
    appState.setUser(uObject);
});
