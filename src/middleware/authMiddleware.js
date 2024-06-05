const admin = require('firebase-admin');

module.exports = {
    name: 'authMiddleware',
    version: '1.0.0',
    register: async function (server, options) {
        server.auth.scheme('firebase', () => ({
            authenticate: async (request, h) => {
                const authorization = request.headers.authorization;
                if (!authorization) {
                    throw Boom.unauthorized('Missing authentication');
                }

                const token = authorization.replace('Bearer ', '');
                try {
                    const decodedToken = await admin.auth().verifyIdToken(token);
                    return h.authenticated({ credentials: decodedToken });
                } catch (error) {
                    throw Boom.unauthorized('Invalid token');
                }
            }
        }));

        server.auth.strategy('default', 'firebase');
        server.auth.default('default');
    }
};
