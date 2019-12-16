import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
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

const messaging = firebase.messaging();

messaging.usePublicVapidKey('BBMM5xOsOkTTxPETRZn2agN9nfqG9um0OjYKtT4eE8nobB_DAxjsnxKk_gRhMzCMorWx5qrKWrOEValy4ndCD7U');

Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
    } else {
        console.log('Unable to get permission to notify.');
    }
});

let auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        firebase.firestore().collection('users').doc(user.uid).onSnapshot(snapshot => {
            localStorage.setItem('userDocument', JSON.stringify({id: snapshot.id, data: snapshot.data()}))
        });
    }
    else {
        localStorage.setItem('user', JSON.stringify(null));
        localStorage.setItem('userDocument', JSON.stringify(null));
        localStorage.setItem('clubDocument', JSON.stringify(document))
    }
});

export {user, firebase, auth, Collection, Document}
