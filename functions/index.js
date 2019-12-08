const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.setUpNewUsers = functions.auth.user().onCreate((user) => {
    let email = user.email;
    // Debating club ids are simply the domain name of the school
    let clubID = email.split('@')[1];
    admin.firestore().collection('clubs').doc(clubID).get()
        .then(doc => {
            if (!doc.exists) {
                admin.firestore().collection('clubs').doc(clubID).set({
                    creator: user.uid,
                    created: new Date(),
                });
                admin.firestore().collection('users').doc(user.uid).set({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email
                });
                admin.firestore().collection('clubMemberships').add({
                    userID: user.uid,
                    role: 'administrator'
                });
                return {
                    status: 200,
                }
            }
            else {
                admin.firestore().collection('users').doc(user.uid).set({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email
                });
                admin.firestore().collection('clubMemberships').add({
                    userID: user.uid,
                    role: 'user'
                });
                return {
                    status: 200
                }
            }
        })


});
