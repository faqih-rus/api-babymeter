const { ClientError } = require('../exceptions/ClientError');
const Joi = require('joi');
const { predictClassification } = require('../services/inferenceService');
const storePredictionData = require('../services/storeData');
const loadModel = require('../services/loadModel');
const firebase = require('firebase');

let model;

(async () => {
    model = await loadModel();
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
            chestCircumference: Joi.number().positive().required()
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

        const imageBuffer = data.imageBuffer;

        const predictionResult = await predictClassification(model, imageBuffer, measurements);

        await storePredictionData({
            ...value,
            prediction: predictionResult.label,
            confidence: predictionResult.confidence,
            suggestion: predictionResult.suggestion
        });

        return h.response({
            status: 'success',
            data: {
                ...value,
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
