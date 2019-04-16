import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import config from "./config";

const settings = {};

firebase.initializeApp(config.firebaseConfig);

firebase.firestore().settings(settings);

export default firebase;