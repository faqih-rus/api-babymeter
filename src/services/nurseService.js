const { db } = require('../config/firebaseConfig');
const { 
    doc, 
    setDoc, 
    collection, 
    getDocs, 
    getDoc, 
    updateDoc, 
    deleteDoc 
} = require("firebase/firestore");

const savePrediction = async (predictionData) => {
    try {
        const predictionDoc = doc(db, "predictions", predictionData.nik);
        await setDoc(predictionDoc, predictionData);
    } catch (error) {
        console.error('Error saving prediction:', error);
        throw error;
    }
};

const getPredictions = async () => {
    try {
        const predictionsCollection = collection(db, "predictions");
        const snapshot = await getDocs(predictionsCollection);
        const predictions = snapshot.docs.map(doc => ({
            nik: doc.id,
            ...doc.data()
        }));
        return predictions;
    } catch (error) {
        console.error("Error fetching predictions:", error);
        throw error;
    }
};

const getPredictionById = async (predictionNik) => {
    try {
        const docRef = doc(db, "predictions", predictionNik);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { nik: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching prediction by NIK:", error);
        throw error;
    }
};

const updatePrediction = async (predictionNik, updates) => {
    try {
        const docRef = doc(db, "predictions", predictionNik);
        await updateDoc(docRef, updates);
    } catch (error) {
        console.error("Error updating prediction:", error);
        throw error;
    }
};

const deletePrediction = async (predictionNik) => {
    try {
        const docRef = doc(db, "predictions", predictionNik);
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
