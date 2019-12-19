import {action, decorate, observable, observe} from "mobx";
import {auth, firebase} from "../sync";
import {primitive, serializable} from "serializr";
import {persist} from 'mobx-persist';


let findItem = (item, list) => {
    return list.findIndex(o => {
        return o.id === item.id
    });
};

class Messages {
    messages = [];

    addMessage(message) {
        this.messages.push({
            id: this.messages.length - 1,
            title: message.title,
            body: message.body,
            category: message.category
        })
    }

    deleteMessage(id) {
        let message = this.messages.findIndex(o => {
            return o.id === id
        });
        this.messages.splice(message, 1);
    }
}

decorate(Messages, {
    messages: [persist("object"), observable],
    addMessage: action,
    deleteMessage: action
});

export const messages = new Messages();

class Calendar {
    events = [];
    populated = false;

    updateEvent(event) {
        let foundEvent = findItem(event, this.events);

        if (foundEvent !== -1) {
            this.events[foundEvent] = event
        }
        else {
            this.events.push(event)
        }
    }
}


decorate(Calendar, {
    events: [persist("object"), observable],
    populated: observable,
    updateEvents: action
});

export const calendar = new Calendar();


class DebatingClub {
    club = null;

    setClub(club) {
        this.club = club;
    }
}

decorate(DebatingClub, {
    club: [persist("object"), observable],
    setClub: action
});

export const debatingClub = new DebatingClub();


class AttendanceEvents {
    events = [];
    populated = false;

    updateEvent(event) {
        let foundEvent = findItem(event, this.events);
        if (foundEvent !== -1) {
            this.events[foundEvent] = event
        }
        else {
            this.events.push(event)
        }
    }
}

decorate(AttendanceEvents, {
    events: [persist("object"), observable],
        populated: observable,
        updateEvent: action
    }
);

export const attendanceEvents = new AttendanceEvents();

class RegisterDocuments {
    docs = [];

    updateDoc(doc) {
        let foundDoc = findItem(doc, this.docs);
        if (foundDoc !== -1) {
            this.docs[foundDoc] = doc
        }
        else {
            this.docs.push(doc)
        }
    }
}

decorate(RegisterDocuments, {
    docs: [persist("object"), observable],
    updateDoc: action
});

export const registerDocuments = new RegisterDocuments();


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


// We don't listen to firebase.auth().onAuthstateChanged so that we don't create too many snapshot listeners
observe(appState, "user", change => {
    let uObject = change.newValue;
    if (uObject) {
        appState.setUser(uObject);
        firebase.firestore().collection('users').doc(uObject.uid).get()
            .then(doc => {
                appState.setUserDocument(doc)
            });
        firebase.firestore().collection('clubMemberships').doc(uObject.uid).get()
            .then(doc => {
                debatingClub.setClub({id: doc.id, ...doc.data()});
                firebase.firestore().collection('calendar').where('clubID', '==', doc.data().clubID)
                    .onSnapshot(snapshot => {
                        snapshot.forEach(doc => {
                            calendar.updateEvent({id: doc.id, ...doc.data()})
                        })
                    });
                if (doc.data().role === 'admin') {
                    firebase.firestore().collection('register').where('clubID', '==', doc.data().clubID)
                        .onSnapshot(snapshot => {
                            snapshot.forEach(doc => {
                                registerDocuments.updateDoc({id: doc.id, ...doc.data()});
                            })
                        });
                }
            });

        firebase.firestore().collection('attendance').where('userID', '==', uObject.uid)
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    attendanceEvents.updateEvent({id: doc.id, ...doc.data()})
                })
            });
    }
    else {
        appState.setUserDocument(null);
    }
});

auth.onAuthStateChanged(uObject => {
    appState.setUser(uObject);
});
