const { doc, setDoc, collection, getDocs, getDoc, updateDoc, deleteDoc } = require("firebase/firestore");
const { db } = require('../config/firebaseConfig');

const savePrediction = async (userId, predictionData) => {
    try {
        const userPredictionDoc = doc(db, "predictions", userId, "data", predictionData.id);
        await setDoc(userPredictionDoc, predictionData);
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

const getPredictionById = async (userId, predictionId) => {
    try {
        const docRef = doc(db, "predictions", userId, "data", predictionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching prediction by ID:", error);
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


const deletePrediction = async (userId, predictionId) => {
    try {
        const docRef = doc(db, "predictions", userId, "data", predictionId);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting prediction:", error);
        throw error;
    }
};

const updateProfile = async (userId, profileData) => {
    try {
        
        const userDocRef = doc(db, "Users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            throw new Error(`No document found for user: ${userId}`);
        }

        await updateDoc(userDocRef, profileData);

        const updatedUserDoc = await getDoc(userDocRef);
        return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
    } catch (error) {
        console.error("Error updating profile in Users collection:", error);
        throw error;
    }
};

module.exports = {
    savePrediction,
    getPredictions,
    getPredictionById,
    updatePrediction,
    deletePrediction,
    updateProfile
};
