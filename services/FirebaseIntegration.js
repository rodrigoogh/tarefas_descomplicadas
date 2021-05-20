import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx",
    appId: "xxx",
    measurementId: "xxx"
};

export default class FirebaseIntegration {

    constructor(callback) {
        this.initialize(callback);
    }

    initialize(callback) {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                callback(null, user);
            } else {
                firebase.auth().signInAnonymously().catch(error => {
                   callback(error); 
                });
            }
        });
    }

    get userId() {
        return firebase.auth().currentUser.uid;
    }

    get reference() {
        return firebase.firestore().collection('users').doc(this.userId).collection('toDoList');
    }

}