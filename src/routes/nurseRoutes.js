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
                    imageUrl: Joi.string().uri().required(),
                    babyName: Joi.string().required(),
                    age: Joi.number().integer().required(),
                    weight: Joi.number().required(),
                    id: Joi.string().required()
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
                    id: Joi.string().optional(),
                    weight: Joi.number().optional()
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
                    password: Joi.string().min(6).optional()
                })
            }
        },
        handler: updateNurseProfile
    }
];
