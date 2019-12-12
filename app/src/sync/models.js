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
    populated = false;

    updateEvent(event) {
        let foundEvent = findEvent(event, this.events);
        if (foundEvent) {
            this.events[foundEvent] = event
        }
        else {
            this.events.push(event)
        }
    }
}


decorate(Calendar, {
    events: observable,
    populated: observable,
    updateEvents: action
});

export const calendar = new Calendar();


class DebatingClubs {
    clubs = [];
    populated = false;

    updateClub(club) {
        let foundClub = findEvent(club, this.clubs);
        if (foundClub) {
            this.clubs[foundClub] = club
        }
        else {
            this.clubs.push(club)
        }
    }
}

decorate(DebatingClubs, {
    clubs: observable,
    populated: observable,
    updateClub: action
});

export const debatingClubs = new DebatingClubs();

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
    user: observable,
    userDocument: observable,
    setUser: action,
    setUserDocument: action,
});

export const appState = new AppState();

auth.onAuthStateChanged(uObject => {
    appState.setUser(uObject);
    if (uObject) {
        firebase.firestore().collection('users').doc(uObject.uid).get()
            .then(result => {
                appState.setUserDocument(result)
            });
        firebase.firestore().collection('clubMemberships').where('userID', '==', uObject.uid)
            .onSnapshot(result => {
                if (result.size > 0) {
                    result.docs.forEach(doc => {
                        debatingClubs.updateClub({id: doc.id, ...doc.data()});
                        firebase.firestore().collection('calendar').where('clubID', '==', doc.id)
                            .onSnapshot((snapshot => {
                                snapshot.forEach(
                                    doc => {
                                        calendar.updateEvent({id: doc.id, ...doc.data()})
                                    }
                                )
                            }))
                    });
                }
            });
    }
    else {
        appState.setUserDocument(null);
    }

});
