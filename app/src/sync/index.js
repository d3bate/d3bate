import * as firebase from "firebase";
import {Collection, Document, initFirestorter} from 'firestorter';

let user = null;

firebase.initializeApp({
    apiKey: "AIzaSyA1hST1haguE-Mv_f3HxnVIxZ0UQ8SE23A",
    authDomain: "debating-cc8a6.firebaseapp.com",
    databaseURL: "https://debating-cc8a6.firebaseio.com",
    projectId: "debating-cc8a6",
    storageBucket: "debating-cc8a6.appspot.com",
    messagingSenderId: "919247722618",
    appId: "1:919247722618:web:1213ea172be00b262a83c3",
    measurementId: "G-S4E4G91RGX"
});

initFirestorter({firebase: firebase});

firebase.analytics();

let auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        firebase.firestore().collection('users').doc(user.uid).get().then(result => {
            localStorage.setItem('userDocument', JSON.stringify(result.data()))
        })
    }
    else {
        localStorage.setItem('user', JSON.stringify(null));
        localStorage.setItem('userDocument', JSON.stringify(null))
    }
});

export {user, firebase, auth, Collection, Document}
