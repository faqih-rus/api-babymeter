const Joi = require('joi');

const register = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ibu', 'perawat').required(),
    nik: Joi.string().when('role', {
        is: 'ibu',
        then: Joi.required(),
        otherwise: Joi.forbidden()
    })
});

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

module.exports = {
    register,
    login
};
