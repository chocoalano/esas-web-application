import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAeqP39LvXmJGZmcqHgx897PvcC8y0TX9U",
  authDomain: "esas-44d5d.firebaseapp.com",
  projectId: "esas-44d5d",
  storageBucket: "esas-44d5d.appspot.com",
  messagingSenderId: "437545364197",
  appId: "1:437545364197:web:78e07bbbfe76319e0a020c",
  measurementId: "G-2K5K3MHEFX",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestPermission = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");
      // Register service worker manually
      const swReg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, {
        vapidKey: import.meta.FIREBASE_VAPID_ID,
        serviceWorkerRegistration: swReg,
      });

      console.log("FCM Token:", token);
      return token;
    } else {
      console.warn("Notification permission not granted.");
    }
  } catch (err) {
    console.error("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
