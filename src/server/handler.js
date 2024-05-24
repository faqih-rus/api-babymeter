const firebase = require('firebase');
const { ClientError } = require('./exceptions/ClientError');
const Joi = require('joi');

// Firebase configuration and initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
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
            height: Joi.number().positive().required()
        });

        const { error, value } = schema.validate(data);
        if (error) {
            throw new ClientError(error.details[0].message);
        }

        // Prepare input for the model
        const inputBuffer = new Float32Array([value.age, value.weight, value.height]);
        model.setInput(0, inputBuffer);

        // Make prediction using the model
        model.invoke();
        const outputBuffer = model.getOutput(0);
        const prediction = outputBuffer[0];

        // Save prediction to Firebase
        const newPredictionRef = db.ref('predictions').push();
        await newPredictionRef.set({
            name: value.name,
            age: value.age,
            weight: value.weight,
            height: value.height,
            prediction: prediction,
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
                prediction: prediction
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
