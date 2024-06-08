const { doc, setDoc, collection, addDoc, getDocs, updateDoc } = require("firebase/firestore");
const { db } = require('../config/firebaseConfig');

const savePrediction = async (userId, predictionData) => {
    try {
        const userPredictionsCollection = collection(db, "predictions", userId, "data");
        await addDoc(userPredictionsCollection, predictionData);
    } catch (error) {
        console.error('Error saving prediction:', error);
        throw error;
    }
};

const getPredictions = async (userId) => {
    try {
        const userPredictionsCollection = collection(db, "predictions", userId, "data");
        const snapshot = await getDocs(userPredictionsCollection);
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
        const docRef = doc(db, "predictions", userId, "data", predictionId);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating prediction:", error);
        throw error;
    }
};

const updateProfile = async (userId, profileData) => {
    try {
        const docRef = doc(db, "profiles", userId);
        await updateDoc(docRef, profileData);
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

module.exports = { savePrediction, getPredictions, updatePrediction, updateProfile };
