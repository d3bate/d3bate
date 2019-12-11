import {action, decorate, observable} from "mobx";
import {auth, firebase} from "../sync";

let findEvent = (event, list) => {
    for (let i = 0; i < list.length; i++) {
        if (list[i]['id'] === event['id']) {
            return i
        }
    }
    return false;
};

class Calendar {
    events = [];
    loaded = false;

    updateEvent(event, loaded) {
        let foundEvent = findEvent(event, this.events);
        if (foundEvent) {
            this.events[foundEvent] = event
        }
        else {
            this.events.push()
        }
    }
}

decorate(Calendar, {
    events: observable,
    loaded: observable,
    updateEvents: action
});

export const calendar = new Calendar();


class AppState {
    user = null;
    userDocument = null;
    debatingClubs = {
        docs: []
    };

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
            appState.setDebatingClubs(result);
            if (result.size > 0) {
                result.docs.forEach(doc => {
                    calendar.updateEvent({id: doc.id, ...doc.data()})
                });
            }
        })
});
