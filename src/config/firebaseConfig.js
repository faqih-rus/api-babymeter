// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const admin = require('firebase-admin');
const config = require('./config.js');

const firebaseApp = initializeApp(config.firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(config.firebaseAdminConfig),
});

const db = getFirestore(firebaseApp);
module.exports = { db, firebaseApp };
