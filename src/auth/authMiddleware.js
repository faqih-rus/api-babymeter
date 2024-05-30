const jwt = require('jsonwebtoken');
const Boom = require('@hapi/boom');

const authenticate = (request, h) => {
    const authorization = request.headers.authorization;

    if (!authorization) {
        throw Boom.unauthorized('Missing authorization header');
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.auth = { credentials: decoded };
        return h.continue;
    } catch (error) {
        throw Boom.unauthorized('Invalid token');
    }
};

module.exports = {
    authenticate
};
