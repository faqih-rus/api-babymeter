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
                    babyName: Joi.string().optional(),
                    age: Joi.number().integer().optional(),
                    weight: Joi.number().optional(),
                    lingkar_kepala: Joi.number().optional(),
                    lingkar_dada: Joi.number().optional(),
                    lingkar_lengan: Joi.number().optional(),
                    lingkar_perut: Joi.number().optional(),
                    lingkar_paha: Joi.number().optional(),
                    panjang_badan: Joi.number().optional(),
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
