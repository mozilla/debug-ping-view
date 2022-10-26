import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import config from './config';

const settings = {};

const app = initializeApp(config.firebaseConfig);
const db = getFirestore(app, settings);
const auth = getAuth(app);

export { app, auth, db };
