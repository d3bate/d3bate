import {action, decorate, observable} from "mobx";
import {auth, firebase} from "../sync";


class AppState {
    user = null;
    userDocument = null;
    debatingClubs = null;

    setUser(user) {
        this.user = user
    }

    setUserDocument(document) {
        this.userDocument = document
    }

    setDebatingClubs(clubs) {
        this.debatingClubs = clubs
    }
}

decorate(AppState, {
    user: observable,
    userDocument: observable,
    debatingClubs: observable,
    setUser: action,
    setUserDocument: action,
    setDebatingClubs: action
});

export const appState = new AppState();

auth.onAuthStateChanged(uObject => {
    appState.setUser(uObject);
    firebase.firestore().collection('users').doc(uObject.uid).get()
        .then(result => {
            appState.setUserDocument(result)
        });
    firebase.firestore().collection('clubMemberships').where('userID', '==', uObject.uid)
        .get()
        .then(result => {
            appState.setDebatingClubs(result)
        })
});
