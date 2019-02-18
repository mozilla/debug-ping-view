import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {};

const config = {
    apiKey: "AIzaSyCYGEoBFK6AzgE7H__FjdVUQ_vVnaEKaqA",
    authDomain: "debug-ping-preview.firebaseapp.com",
    databaseURL: "https://debug-ping-preview.firebaseio.com",
    projectId: "debug-ping-preview",
    storageBucket: "debug-ping-preview.appspot.com",
    messagingSenderId: "83999817115"
};
firebase.initializeApp(config);


firebase.firestore().settings(settings);

export default firebase;