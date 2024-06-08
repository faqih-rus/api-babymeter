// authMiddleware.js
const admin = require('firebase-admin');
const Boom = require('@hapi/boom');

module.exports = {
  name: 'authMiddleware',
  version: '1.0.0',
  register: async function (server, options) {
    server.auth.scheme('firebase', () => ({
      authenticate: async (request, h) => {
        const authorization = request.headers.authorization;
        if (!authorization) {
          console.error('Missing authentication header');
          throw Boom.unauthorized('Missing authentication');
        }

        const token = authorization.replace('Bearer ', '');
        try {
          const decodedToken = await admin.auth().verifyIdToken(token);
          console.log('Decoded Token:', decodedToken); // Debugging log
          return h.authenticated({ credentials: decodedToken });
        } catch (error) {
          console.error('Invalid token:', error);
          throw Boom.unauthorized('Invalid token');
        }
      }
    }));

    server.auth.strategy('default', 'firebase');
    server.auth.default('default');
  }
};