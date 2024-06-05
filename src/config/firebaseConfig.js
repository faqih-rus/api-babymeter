// src/config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./capstone-babymeter-firebase-adminsdk-f1kgg-1bf92a891c.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://capstone-babymeter-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

module.exports = { db };

