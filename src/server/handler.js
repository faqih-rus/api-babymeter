const { ClientError } = require('../exceptions/ClientError');
const Joi = require('joi');
const { predictClassification } = require('../services/inferenceService');
const { storeData } = require('../services/storeData');
const loadModel = require('../services/loadModel');
const { db } = require('../config/firebaseConfig');

let model;

// Memuat model saat aplikasi mulai
(async () => {
    try {
        model = await loadModel();
    } catch (error) {
        console.error('Error loading model:', error);
    }
})();

async function postPredictionsHandler(request, h) {
    try {
        const data = request.payload;

        const schema = Joi.object({
            name: Joi.string().required(),
            age: Joi.number().integer().min(0).required(),
            weight: Joi.number().positive().required(),
            height: Joi.number().positive().required(),
            headCircumference: Joi.number().positive().required(),
            armCircumference: Joi.number().positive().required(),
            abdomenCircumference: Joi.number().positive().required(),
            chestCircumference: Joi.number().positive().required(),
            imageBuffer: Joi.any().meta({ swaggerType: 'file' }).required()
        });

        const { error, value } = schema.validate(data);
        if (error) {
            throw new ClientError(error.details[0].message);
        }

        const measurements = {
            headCircumference: value.headCircumference,
            armCircumference: value.armCircumference,
            abdomenCircumference: value.abdomenCircumference,
            chestCircumference: value.chestCircumference,
            height: value.height
        };

        const imageBuffer = value.imageBuffer._data; // Mendapatkan buffer data dari file upload

        const predictionResult = await predictClassification(model, imageBuffer, measurements);

        const predictionData = {
            ...value,
            prediction: predictionResult.label,
            confidence: predictionResult.confidenceScore,
            suggestion: predictionResult.suggestion,
            createdAt: new Date().toISOString()
        };

        await storeData(predictionData);

        return h.response({
            status: 'success',
            data: predictionData
        }).code(201);
    } catch (error) {
        if (error instanceof ClientError) {
            return h.response({
                status: 'fail',
                message: error.message
            }).code(400);
        }

        console.error(error);
        return h.response({
            status: 'error',
            message: 'Internal Server Error'
        }).code(500);
    }
}

async function getPredictionsHandler(request, h) {
    try {
        const predictionsSnapshot = await db.collection('predictions').get();
        const predictions = predictionsSnapshot.docs.map(doc => doc.data());

        return h.response({
            status: 'success',
            data: predictions
        }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({
            status: 'error',
            message: 'Internal Server Error'
        }).code(500);
    }
}

module.exports = { postPredictionsHandler, getPredictionsHandler };
