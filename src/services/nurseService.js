// src/services/nurseService.js
const { db } = require('../config/firebaseConfig');

const savePrediction = async (userId, prediction) => {
    try {
        const docRef = db.collection('predictions').doc(userId).collection('data').doc(prediction.id);
        await docRef.set(prediction);
        return docRef.id;
    } catch (error) {
        console.error("Error saving prediction:", error); // Log the error for debugging
        throw error; // Re-throw the error to be handled by the calling function
    }
};

const getPredictions = async (userId) => {
    try {
        const snapshot = await db.collection('predictions').doc(userId).collection('data').get();
        const predictions = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        return predictions;
    } catch (error) {
        console.error("Error fetching predictions:", error);
        throw error;
    }
};

const updatePrediction = async (userId, predictionId, updates) => {
    try {
        const docRef = db.collection('predictions').doc(userId).collection('data').doc(predictionId);
        await docRef.update(updates);
    } catch (error) {
        console.error("Error updating prediction:", error);
        throw error;
    }
};

const updateProfile = async (userId, profileData) => {
    try {
        const docRef = db.collection('profiles').doc(userId);
        await docRef.update(profileData);
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

module.exports = { savePrediction, getPredictions, updatePrediction, updateProfile };
