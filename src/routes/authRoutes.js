// authRoutes.js
const Joi = require('joi');
const { register, login } = require('../controllers/authController');

module.exports = [
    {
        method: 'POST',
        path: '/auth/register',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required(),
                    name: Joi.string().required(),
                })
            }
        },
        handler: register
    },
    {
        method: 'POST',
        path: '/auth/login',
        options: {
            auth: false,
            validate: {
                payload: Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().min(6).required()
                })
            }
        },
        handler: login
    }
];
