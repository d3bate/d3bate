const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const emailDomain = '@latymer-upper.org';

const emailRegex = new RegExp(emailDomain + '\\s*$');

exports.disableNonDomainAccounts = functions.auth.user().onCreate((user) => {
    let email = user.email;

    if (!emailRegex.test(email)) {
        functions.app.admin.auth().updateUser(user.uid, {disabled: true})
    }
});