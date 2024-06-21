const { savePrediction, getPredictions, getPredictionById, updatePrediction, updateProfile, deletePrediction } = require('../services/nurseService');
const axios = require('axios');
const FormData = require('form-data');
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const { doc, updateDoc, getDoc } = require("firebase/firestore");
const { db } = require('../config/firebaseConfig');
const firebaseApp = require('../config/firebaseConfig');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { getStuntingThresholds } = require('../utils/stuntingUtils');
const { performInference } = require('../utils/inferenceUtils');

const storage = getStorage(firebaseApp.firebaseApp);

// Controller function to create a prediction
const createPrediction = async (request, h) => {
    try {
        const { babyName, age, weight, nik } = request.payload;
        const image = request.payload.image;

        const existingPrediction = await getPredictionById(nik);
        if (existingPrediction) {
            return h.response({ status: 'error', message: 'Prediction ID already exists' }).code(400);
        }

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `predictions/${uuidv4()}`);
        const snapshot = await uploadBytes(storageRef, image._data);
        const imageUrl = await getDownloadURL(snapshot.ref);

        console.log("Sending image to Flask server for processing...");

        const formData = new FormData();
        formData.append('image', image, { filename: 'image.jpg', contentType: 'image/jpeg' });

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

        const { prediction, suggestion, confidence } = performInference(age, weight, panjang_badan, mlResult);

        const predictionData = {
            nik, babyName, age, weight,
            imageUrl,
            ...mlResult,
            prediction, confidence, suggestion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await savePrediction(predictionData);
        return h.response({ status: 'success', data: predictionData }).code(201);
    } catch (error) {
        console.error('Error creating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

// Controller function to get prediction data
const getPredictionData = async (request, h) => {
    try {
        const predictions = await getPredictions();

        if (!predictions || predictions.length === 0) {
            console.warn('No predictions found');
            return h.response({ status: 'success', data: [] }).code(200);
        }

        return h.response({ status: 'success', data: predictions }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

// Controller function to modify a prediction
const modifyPrediction = async (request, h) => {
    try {
        const { nik } = request.params;
        const { nik: newNik, weight } = request.payload;

        const updateData = {
            ...(newNik && { nik: newNik }),
            ...(weight && { weight: weight })
        };

        const updatedPrediction = await updatePrediction(nik, updateData);
        return h.response({ status: 'success', data: updatedPrediction }).code(200);
    } catch (error) {
        console.error('Error updating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

// Controller function to get prediction by NIK
const getPredictionByIdHandler = async (request, h) => {
    try {
        const { nik } = request.params;

        const prediction = await getPredictionById(nik);
        if (!prediction) {
            return h.response({ status: 'error', message: 'Prediction not found' }).code(404);
        }

        return h.response({ status: 'success', data: prediction }).code(200);
    } catch (error) {
        console.error('Error fetching prediction by NIK:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

// Controller function to delete a prediction
const deletePredictionHandler = async (request, h) => {
    try {
        const { nik } = request.params;

        const prediction = await getPredictionById(nik);
        if (!prediction) {
            return h.response({ status: 'error', message: 'Prediction not found' }).code(404);
        }

        await deletePrediction(nik);
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
    getPredictionByIdHandler,
    deletePredictionHandler
};
