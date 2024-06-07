const Joi = require('joi');

const registerSchema = Joi.object({
    token: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const createPredictionSchema = Joi.object({
    imageUrl: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().integer().required(),
    headCircumference: Joi.number().required(),
    armCircumference: Joi.number().required(),
    abdomenCircumference: Joi.number().required(),
    chestCircumference: Joi.number().required(),
    height: Joi.number().required(),
    weight: Joi.number().min(0).required(),
    id: Joi.string().required(),
    babyName: Joi.string().required()
});

const updatePredictionSchema = Joi.object({
    name: Joi.string().optional(),
    height: Joi.number().optional(),
    headCircumference: Joi.number().optional(),
    armCircumference: Joi.number().optional(),
    abdomenCircumference: Joi.number().optional(),
    chestCircumference: Joi.number().optional(),
    prediction: Joi.string().optional(),
    confidence: Joi.number().optional(),
    suggestion: Joi.string().optional()
});

const updateProfileSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    picture: Joi.string().optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    createPredictionSchema,
    updatePredictionSchema,
    updateProfileSchema
};
