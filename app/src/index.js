import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';
import './sync/models/listener';
import {firebase} from './sync';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function (registration) {
            firebase.messaging().useServiceWorker(registration);
            console.log("Registration successful, scope is:", registration.scope);
            try {
                const messaging = firebase.messaging();

                messaging.usePublicVapidKey('BBMM5xOsOkTTxPETRZn2agN9nfqG9um0OjYKtT4eE8nobB_DAxjsnxKk_gRhMzCMorWx5qrKWrOEValy4ndCD7U');

                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        console.log('Notification permission granted.');
                        const token = messaging.getToken();
                        // ...
                    } else {
                        console.log('Unable to get permission to notify.');
                    }
                });

                messaging.onMessage(payload => {
                    console.log('message received. ', payload)
                })
            } catch (e) {
            }
        })
        .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
}


ReactDOM.render(<App/>, document.getElementById('root'));
Sentry.init({
    dsn: "https://393bee494b7242b6b21273b8787227c3@sentry.io/1844736",
    beforeSend(event, hint) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
            Sentry.showReportDialog({
                eventId: event.event_id,
                title: "Uh oh...",
                subtitle: "This application has crashed. Please consider filling in a crash report or creating an issue on our Github page (https://github.com/d3bate/d3bate) - this helps us to improve and develop this FOSS (free and open source) software.",
                labelComments: "What were you doing when the crash happened?",

            });
        }
        return event;
    }
});

navigator.serviceWorker.addEventListener("message", (message) => console.log(message));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
