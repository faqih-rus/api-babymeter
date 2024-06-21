// firebaseConfig.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require("firebase/storage");
const admin = require('firebase-admin');
const config = require('./config.js');

const firebaseApp = initializeApp(config.firebaseConfig);
admin.initializeApp({
  credential: admin.credential.cert(config.firebaseAdminConfig),
});

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

module.exports = { storage ,db, firebaseApp };
