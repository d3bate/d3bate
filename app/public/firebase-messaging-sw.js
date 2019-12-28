importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
firebase.initializeApp({
    messagingSenderId: "919247722618"
});
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'd3bate notificaiton';
    const notificationOptions = {
        body: 'Notification',
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});
