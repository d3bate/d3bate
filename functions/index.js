const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const emailDomain = '@latymer-upper.org';

const emailRegex = new RegExp(emailDomain + '\\s*$');

exports.setUpNewUsers = functions.auth.user().onCreate((user) => {
    let email = user.email;

    if (!emailRegex.test(email)) {
        functions.app.admin.auth().updateUser(user.uid, {disabled: true})
    }

    functions.app.admin.firestore().doc('/users/' + user.uid).set({
        userId: user.uid,
        admin: false,
        email: user.email
    })
});


exports.createDebatingClub = functions.https.onCall((data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('failed-precondition', 'This function may only be executed by an authenticated user.')
    }
    let clubName = data['clubName'];
    if (!clubName) {
        throw new functions.https.HttpsError('invalid-argument', 'All debating clubs must have a name.')
    }

});
