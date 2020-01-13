import {observe} from "mobx";
import {firebase} from "../index";
import {appState} from "../models";
import {debatingClub} from "./club";
import {registerDocuments} from "./register";
import {calendar} from "./calendar";
import {attendanceEvents} from "./attendance";
import {clubUsers} from "./clubUsers";
import {debateNotes} from "./debateNotes";


let registerDocumentsListener;
let calendarListener;
let attendanceEventsListener;
let clubMembershipListener;
let clubUsersListener;
let debateNotesListener;


observe(appState, "user", change => {
    let uObject = change.newValue;
    if (uObject) {
        appState.setUser(uObject);
        firebase.firestore().collection('users').doc(uObject.uid).get()
            .then(doc => {
                appState.setUserDocument(doc);
            });

        clubMembershipListener = firebase.firestore().collection('clubMemberships').doc(uObject.uid).get()
            .then(doc => {
                debatingClub.setClub({id: doc.id, ...doc.data()});
                calendarListener = firebase.firestore().collection('calendar').where('clubID', '==', doc.data().clubID)
                    .onSnapshot(snapshot => {
                        snapshot.forEach(doc => {
                            calendar.updateEvent({id: doc.id, ...doc.data()})
                        })
                    });

                let clubUsersListener = firebase.firestore().collection('clubMemberships').where('clubID', '==', doc.data().clubID)
                    .onSnapshot(snapshot => {
                        snapshot.forEach(membershipDoc => {
                            firebase.firestore().collection('users').doc(membershipDoc.id)
                                .get()
                                .then(userDoc => {
                                    clubUsers.updateUser({id: userDoc.id, ...userDoc.data()})
                                })
                        })
                    });

                if (doc.data().role === 'admin') {
                    debateNotesListener = firebase.firestore().collection('judge').where('clubID', '==', doc.data().clubID).onSnapshot(snapshot => {
                        snapshot.forEach(note => {
                            debateNotes.updateDebate({id: note.id, ...note.data()})
                        })
                    });
                    registerDocumentsListener = firebase.firestore().collection('register').where('clubID', '==', doc.data().clubID)
                        .onSnapshot(snapshot => {
                            snapshot.forEach(doc => {
                                registerDocuments.updateDoc({id: doc.id, ...doc.data()});
                            });
                            registerDocuments.loaded = true;
                        });
                }
            });

        attendanceEventsListener = firebase.firestore().collection('attendance').where('userID', '==', uObject.uid)
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    attendanceEvents.updateEvent({id: doc.id, ...doc.data()})
                })
            });
    } else {
        appState.setUserDocument(null);
    }
});
