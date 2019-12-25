import {observe} from "mobx";
import {firebase} from "../index";
import {appState} from "../models";
import {debatingClub} from "./club";
import {registerDocuments} from "./register";
import {calendar} from "./calendar";
import {attendanceEvents} from "./attendance";


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
