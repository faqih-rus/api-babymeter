// src/routes/nurseRoutes.js
const Joi = require('joi');
const {
    createPrediction,
    getPredictionData,
    modifyPrediction,
    updateNurseProfile
} = require('../controllers/nurseController');

module.exports = [
    {
        method: 'POST',
        path: '/nurse/predictions',
        options: {
            validate: {
                payload: Joi.object({
                    imageUrl: Joi.string().required(),
                    name: Joi.string().required(),
                    age: Joi.number().integer().required()
                })
            }
        },
        handler: createPrediction
    },
    {
        method: 'GET',
        path: '/nurse/predictions',
        handler: getPredictionData
    },
    {
        method: 'PUT',
        path: '/nurse/predictions/{id}',
        options: {
            validate: {
                params: Joi.object({
                    id: Joi.string().required()
                }),
                payload: Joi.object({
                    name: Joi.string().optional(),
                    height: Joi.number().optional(),
                    headCircumference: Joi.number().optional(),
                    armCircumference: Joi.number().optional(),
                    abdomenCircumference: Joi.number().optional(),
                    chestCircumference: Joi.number().optional(),
                    prediction: Joi.string().optional(),
                    confidence: Joi.number().optional(),
                    suggestion: Joi.string().optional()
                })
            }
        },
        handler: modifyPrediction
    },
    {
        method: 'PUT',
        path: '/nurse/profile',
        options: {
            validate: {
                payload: Joi.object({
                    name: Joi.string().optional(),
                    email: Joi.string().email().optional(),
                    picture: Joi.string().optional()
                })
            }
        },
        handler: updateNurseProfile
    }
];
