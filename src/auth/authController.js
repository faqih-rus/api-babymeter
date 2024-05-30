const authService = require('./authService');
const Boom = require('@hapi/boom');

const register = async (request, h) => {
    try {
        const { email, password, role, nik } = request.payload;
        const user = await authService.register({ email, password, role, nik });
        return h.response(user).code(201);
    } catch (error) {
        return Boom.badImplementation(error.message);
    }
};

const login = async (request, h) => {
    try {
        const { email, password } = request.payload;
        const token = await authService.login({ email, password });
        return h.response({ token }).code(200);
    } catch (error) {
        return Boom.unauthorized(error.message);
    }
};

module.exports = {
    register,
    login
};
