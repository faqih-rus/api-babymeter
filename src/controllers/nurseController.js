const { savePrediction, getPredictions, updatePrediction, updateProfile } = require('../services/nurseService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

exports.createPrediction = async (request, h) => {
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

        return h.response({
            status: "success",
            message: "Prediction created",
            data: prediction
        }).code(201);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

exports.getPredictionData = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const predictions = await getPredictions(userId);
        return h.response(predictions).code(200);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

exports.modifyPrediction = async (request, h) => {
    try {
        const { id } = request.params;
        const updates = request.payload;
        const userId = request.auth.credentials.uid;
        updates.updatedAt = new Date().toISOString();
        await updatePrediction(userId, id, updates);
        return h.response({ message: "Prediction updated successfully" }).code(200);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};

exports.updateNurseProfile = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const profileData = request.payload;
        await updateProfile(userId, profileData);
        return h.response({ message: "Profile updated successfully" }).code(200);
    } catch (error) {
        return h.response({ error: error.message }).code(400);
    }
};
