    const Joi = require('joi');
    const { register, login } = require('./authService');

    async function registerHandler(request, h) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        const { error, value } = schema.validate(request.payload);
        if (error) {
            return h.response({ status: 'fail', message: error.details[0].message }).code(400);
        }

        try {
            const user = await register(value);
            return h.response({ status: 'success', user }).code(201);
        } catch (err) {
            return h.response({ status: 'fail', message: err.message }).code(400);
        }
    }

    async function loginHandler(request, h) {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        });

        const { error, value } = schema.validate(request.payload);
        if (error) {
            return h.response({ status: 'fail', message: error.details[0].message }).code(400);
        }

        try {
            const token = await login(value);
            return h.response({ status: 'success', token }).code(200);
        } catch (err) {
            return h.response({ status: 'fail', message: err.message }).code(400);
        }
    }

    module.exports = { registerHandler, loginHandler };
