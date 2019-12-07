const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const emailRegex = new RegExp(emailDomain + '\\s*$');

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
                    administrators: [user.uid],
                    users: [user.uid]
                });
                admin.firestore().collection('users').doc(user.uid).set({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email
                })
            }
            else {
                admin.firestore().collection('users').doc(user.uid).set({
                    name: user.displayName,
                    uid: user.uid,
                    email: user.email
                });
                let docData = doc.data();
                docData.users.push(user.uid);
                doc.update(docData);
            }
        })


});
