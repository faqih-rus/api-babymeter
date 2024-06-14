// nurseController.js
const { savePrediction, getPredictions, getPredictionById, updatePrediction, updateProfile, deletePrediction } = require('../services/nurseService');
const axios = require('axios');
const FormData = require('form-data');  // Import form-data
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { doc, updateDoc, getDoc } = require("firebase/firestore");
const { db } = require('../config/firebaseConfig');
const firebaseApp = require('../config/firebaseConfig');
const storage = getStorage(firebaseApp.firebaseApp);
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');


const createPrediction = async (request, h) => {
    try {
        const { babyName, age, weight, id } = request.payload;
        const image = request.payload.image;
        const userId = request.auth.credentials.uid;

        const existingPrediction = await getPredictionById(userId, id);
        if (existingPrediction) {
            return h.response({ status: 'error', message: 'Prediction ID already exists' }).code(400);
        }

        console.log("Sending image to Flask server for processing...");

        const formData = new FormData();
        formData.append('image', image._data, {
            filename: 'image.jpg',
            contentType: 'image/jpeg',
        });

        const response = await axios.post('http://34.101.242.192:5000/predict', formData, {
            headers: { ...formData.getHeaders() }
        });

        console.log("Received response from Flask server.");
        const mlResult = response.data;

        const {
            lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan
        } = mlResult;

        if (!lingkar_kepala || !lingkar_dada || !lingkar_lengan || !lingkar_perut || !lingkar_paha || !panjang_badan) {
            throw new Error('Incomplete prediction data');
        }

        const panjangBadanMeter = panjang_badan / 100;
        const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

        let prediction = "Normal";
        let suggestion = "Pertumbuhan normal.";

        if (bmi < 14) {
            prediction = "Di Bawah Normal";
            suggestion = "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.";
        } else if (bmi > 17) {
            prediction = "Obesitas";
            suggestion = "Perhatikan asupan makanan dan aktivitas fisik bayi.";
        }

        const stuntingThresholds = getStuntingThresholds(age);

        if (stuntingThresholds && panjang_badan < stuntingThresholds) {
            prediction = "Stunting";
            suggestion = "Tinggi badan bayi berada di bawah standar. Konsultasikan dengan dokter untuk penanganan lebih lanjut.";
        }

        const predictionData = {
            id: id,
            babyName: babyName,
            age: age,
            weight: weight,
            lingkar_kepala: lingkar_kepala,
            lingkar_dada: lingkar_dada,
            lingkar_lengan: lingkar_lengan,
            lingkar_perut: lingkar_perut,
            lingkar_paha: lingkar_paha,
            panjang_badan: panjang_badan,
            prediction: prediction,
            confidence: 0.95,
            suggestion: suggestion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await savePrediction(userId, predictionData);
        return h.response({ status: 'success', data: predictionData }).code(201);
    } catch (error) {
        console.error('Error creating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const getStuntingThresholds = (age) => {
    const thresholds = {
        0: 49.9,
        1: 54.7,
        2: 58.4,
        3: 61.4,
        4: 64.0,
        5: 66.4,
        6: 68.6,
        7: 70.5,
        8: 72.3,
        9: 73.9,
        10: 75.4,
        11: 76.8,
        12: 78.0,
    };
    return thresholds[age];
};


const getPredictionData = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const predictions = await getPredictions(userId);

        if (!predictions || predictions.length === 0) {
            console.warn('No predictions found for user:', userId);
            return h.response({ status: 'success', data: [] }).code(200);
        }

        return h.response({ status: 'success', data: predictions }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const modifyPrediction = async (request, h) => {
    try {
        const { id } = request.params;
        const { id: newId, weight } = request.payload;
        const userId = request.auth.credentials.uid;

        const updateData = {
            ...(newId && { id: newId }), 
            ...(weight && { weight: weight }) 
        };

        const updatedPrediction = await updatePrediction(userId, id, updateData);
        return h.response({ status: 'success', data: updatedPrediction }).code(200);
    } catch (error) {
        console.error('Error updating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const updateNurseProfile = async (request, h) => {
    try {
      const userId = request.auth.credentials.uid;
      const { name, password } = request.payload;
      const profileImage = request.payload.profileImage;
  
      let updateData = {
        ...(name && { name }),
        ...(password && { password })
      };
  
      if (profileImage) {
        const storageRef = ref(storage, `profiles/${userId}/${uuidv4()}`);
        const snapshot = await uploadBytes(storageRef, profileImage._data);
        const downloadURL = await getDownloadURL(snapshot.ref);
        updateData.profileImageUrl = downloadURL;
      }
  
      const userDocRef = doc(db, "Users", userId);
      await updateDoc(userDocRef, updateData);
  
      const updatedUserDoc = await getDoc(userDocRef);
      return h.response({ status: 'success', data: updatedUserDoc.data() }).code(200);
    } catch (error) {
      console.error('Error updating profile:', error);
      return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
  };
  

const getPredictionByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.uid;

        const prediction = await getPredictionById(userId, id);
        if (!prediction) {
            return h.response({ status: 'error', message: 'Prediction not found' }).code(404);
        }

        return h.response({ status: 'success', data: prediction }).code(200);
    } catch (error) {
        console.error('Error fetching prediction by ID:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const deletePredictionHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.uid;

        const prediction = await getPredictionById(userId, id);
        if (!prediction) {
            return h.response({ status: 'error', message: 'Prediction not found' }).code(404);
        }

        await deletePrediction(userId, id);
        return h.response({ status: 'success', message: 'Prediction deleted successfully' }).code(200);
    } catch (error) {
        console.error('Error deleting prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};


module.exports = {
    createPrediction,
    getPredictionData,
    modifyPrediction,
    updateNurseProfile,
    getPredictionByIdHandler,
    deletePredictionHandler
};

