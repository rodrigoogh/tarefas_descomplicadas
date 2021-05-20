import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA0L9LWWx4_NB6AMmGfFDhS_bG_EFYMpfw",
    authDomain: "projeto-tarefas-descomplicadas.firebaseapp.com",
    databaseURL: "https://projeto-tarefas-descomplicadas-default-rtdb.firebaseio.com",
    projectId: "projeto-tarefas-descomplicadas",
    storageBucket: "projeto-tarefas-descomplicadas.appspot.com",
    messagingSenderId: "1033216492378",
    appId: "1:1033216492378:web:d17265ebcd795502b8e963",
    measurementId: "G-GS3ZFD36PH"
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