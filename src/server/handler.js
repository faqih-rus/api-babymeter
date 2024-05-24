const firebase = require('firebase');
const { ClientError } = require('./exceptions/ClientError');
const Joi = require('joi');
const { predictClassification } = require('../services/inferenceService'); 

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    databaseURL: "DATABASE_URL",
    projectId: "PROJECT_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
    appId: "APP_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();

async function postPredictionsHandler(request, h) {
    try {
        const { model } = request.server.app;
        const data = request.payload;

        // Validate input data
        const schema = Joi.object({
            name: Joi.string().required(),
            age: Joi.number().integer().min(0).required(),
            weight: Joi.number().positive().required(),
            height: Joi.number().positive().required(),
            headCircumference: Joi.number().positive().required(),
            armCircumference: Joi.number().positive().required(),
            abdomenCircumference: Joi.number().positive().required(),
            chestCircumference: Joi.number().positive().required()
        });

        const { error, value } = schema.validate(data);
        if (error) {
            throw new ClientError(error.details[0].message);
        }

        // Prepare input for the model
        const measurements = {
            headCircumference: value.headCircumference,
            armCircumference: value.armCircumference,
            abdomenCircumference: value.abdomenCircumference,
            chestCircumference: value.chestCircumference,
            height: value.height
        };

        // Assuming imageBuffer is provided in the payload
        const imageBuffer = data.imageBuffer;

        // Make prediction using the model
        const predictionResult = await predictClassification(model, imageBuffer, measurements);

        // Save prediction to Firebase
        const newPredictionRef = db.ref('predictions').push();
        await newPredictionRef.set({
            name: value.name,
            age: value.age,
            weight: value.weight,
            height: value.height,
            headCircumference: value.headCircumference,
            armCircumference: value.armCircumference,
            abdomenCircumference: value.abdomenCircumference,
            chestCircumference: value.chestCircumference,
            prediction: predictionResult.label,
            confidence: predictionResult.confidence,
            suggestion: predictionResult.suggestion,
            createdAt: new Date().toISOString()
        });

        // Return response
        return h.response({
            status: 'success',
            data: {
                name: value.name,
                age: value.age,
                weight: value.weight,
                height: value.height,
                headCircumference: value.headCircumference,
                armCircumference: value.armCircumference,
                abdomenCircumference: value.abdomenCircumference,
                chestCircumference: value.chestCircumference,
                prediction: predictionResult.label,
                confidence: predictionResult.confidence,
                suggestion: predictionResult.suggestion
            }
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

module.exports = { postPredictionsHandler };
