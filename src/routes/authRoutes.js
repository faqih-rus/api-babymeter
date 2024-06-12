// authRoutes.js
const Joi = require('joi');
const { register, login, logout, updateProfile } = require('../controllers/authController');

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
    },
    {
        method: 'POST',
        path: '/auth/logout',
        options: {
            auth: false,
            validate: {
                headers: Joi.object({
                    authorization: Joi.string().required()
                }).unknown()
            }
        },
        handler: logout
    },
    {
        method: 'PUT',
        path: '/auth/updateProfile',
        options: {
            auth: 'default',
            validate: {
                payload: Joi.object({
                    name: Joi.string().optional(),
                    password: Joi.string().min(6).optional(),
                    profileImage: Joi.string().optional()
                })
            }
        },
        handler: updateProfile
    }
];
