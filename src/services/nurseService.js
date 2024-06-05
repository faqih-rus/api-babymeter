const { db } = require('../config/firebaseConfig');

async function savePrediction(userId, prediction) {
    const docRef = db.collection('predictions').doc(userId).collection('data').doc(prediction.id);
    await docRef.set(prediction);
    return docRef.id;
}

async function getPredictions(userId) {
    const snapshot = await db.collection('predictions').doc(userId).collection('data').get();
    const predictions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));
    return predictions;
}

async function updatePrediction(userId, predictionId, updates) {
    const docRef = db.collection('predictions').doc(userId).collection('data').doc(predictionId);
    await docRef.update(updates);
}

async function updateProfile(userId, profileData) {
    const docRef = db.collection('profiles').doc(userId);
    await docRef.update(profileData);
}

module.exports = { savePrediction, getPredictions, updatePrediction, updateProfile };
