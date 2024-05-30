const firebase = require('firebase');

async function authenticate(request, h) {
    const authorization = request.headers.authorization;
    if (!authorization) {
        throw new Error('Unauthorized');
    }

    const token = authorization.replace('Bearer ', '');
    try {
        const decodedToken = await firebase.auth().verifyIdToken(token);
        request.auth = {
            credentials: decodedToken,
            isAuthenticated: true
        };
        return h.continue;
    } catch (error) {
        throw new Error('Unauthorized');
    }
}

module.exports = { authenticate };
