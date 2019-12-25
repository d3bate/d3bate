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
    } else {
        appState.setUserDocument(null);
    }
});

auth.onAuthStateChanged(uObject => {
    appState.setUser(uObject);
});
