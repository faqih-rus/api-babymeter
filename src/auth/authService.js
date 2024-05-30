const firebase = require('firebase');
const { ClientError } = require('../exceptions/ClientError');

firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
});

async function register({ email, password }) {
    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw new ClientError(error.message);
    }
}

async function login({ email, password }) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return userCredential.user.getIdToken();
    } catch (error) {
        throw new ClientError(error.message);
    }
}

module.exports = { register, login };
