const { savePrediction, getPredictions, updatePrediction, updateProfile } = require('../services/nurseService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const createPrediction = async (request, h) => {
    try {
        const { imageUrl, name, age } = request.payload;
        const response = await axios.post('<FLASK_INFERENCE_URL>', { imageUrl });
        const predictionData = response.data;
        const userId = request.auth.credentials.uid;

        const prediction = {
            id: uuidv4(),
            name,
            height: predictionData.height,
            headCircumference: predictionData.headCircumference,
            armCircumference: predictionData.armCircumference,
            abdomenCircumference: predictionData.abdomenCircumference,
            chestCircumference: predictionData.chestCircumference,
            prediction: predictionData.prediction,
            confidence: predictionData.confidence,
            suggestion: predictionData.suggestion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await savePrediction(userId, prediction);
        return h.response({ status: 'success', data: prediction }).code(201);
    } catch (error) {
        console.error('Error creating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const getPredictionData = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const predictions = await getPredictions(userId);
        return h.response({ status: 'success', data: predictions }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const modifyPrediction = async (request, h) => {
    try {
        const { id } = request.params;
        const updateData = request.payload;
        const userId = request.auth.credentials.uid;

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
        const updateData = request.payload;

        const updatedProfile = await updateProfile(userId, updateData);
        return h.response({ status: 'success', data: updatedProfile }).code(200);
    } catch (error) {
        console.error('Error updating profile:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    createPrediction,
    getPredictionData,
    modifyPrediction,
    updateNurseProfile
};
