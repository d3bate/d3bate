import * as firebase from "firebase";

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

firebase.analytics();

let auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if (user) {
        window.user = user;
        localStorage.setItem('user', JSON.stringify(user))
    }
    else {
        window.user = null;
        localStorage.setItem('user', JSON.stringify(null))
    }
});

export {user, firebase, auth}