import {getApp, getApps, initializeApp} from "firebase/app";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {firebaseConfig} from "./firebaseConfig";

let firebaseApp;

export const getFirebaseApp = () => {

  if (firebaseApp) {
    return firebaseApp;
  }

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });

  firebaseApp = app;

  return app;
};

