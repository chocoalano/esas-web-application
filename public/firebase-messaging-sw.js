// public/firebase-messaging-sw.js

/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAeqP39LvXmJGZmcqHgx897PvcC8y0TX9U",
  authDomain: "esas-44d5d.firebaseapp.com",
  projectId: "esas-44d5d",
  storageBucket: "esas-44d5d.appspot.com",
  messagingSenderId: "437545364197",
  appId: "1:437545364197:web:78e07bbbfe76319e0a020c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Received background message", payload);
  const { title, ...options } = payload.notification;
  self.registration.showNotification(title, options);
});

