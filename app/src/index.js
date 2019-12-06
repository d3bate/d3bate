import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from '@sentry/browser';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App/>, document.getElementById('root'));
Sentry.init({
    dsn: "https://393bee494b7242b6b21273b8787227c3@sentry.io/1844736",
    beforeSend(event, hint) {
        // Check if it is an exception, and if so, show the report dialog
        if (event.exception) {
            Sentry.showReportDialog({
                eventId: event.event_id,
                title: "Uh oh...",
                subtitle: "Unfortunately it looks like we've encountered a bug...",
                subtitle2: "We'd appreciate it if you'd fill in the form below which will send your report to the team which writes this (freely available) software. If you can code, please consider investing the time in making a pull request to our source repository.",
                labelComments: "What were you doing when the crash happened?",

            });
        }
        return event;
    }
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
