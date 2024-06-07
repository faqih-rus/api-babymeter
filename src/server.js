// server.js
'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const admin = require('firebase-admin');
const errorHandler = require('./utils/errorHandler');
const corsHandler = require('./utils/corsHandler');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  });

  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    {
      plugin: corsHandler
    }
  ]);

  await server.register({
    plugin: require('hapi-auth-jwt2')
  });

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate: async (decoded, request, h) => {
      try {
        const firebaseUser = await admin.auth().getUser(decoded.uid);
        if (firebaseUser) {
          return { isValid: true, credentials: { uid: decoded.uid } };
        } else {
          return { isValid: false };
        }
      } catch (error) {
        console.error('Error validating token:', error);
        return { isValid: false };
      }
    },
    verifyOptions: {
      algorithms: ['HS256']
    }
  });

  server.auth.default('jwt');

  server.route(require('./routes/authRoutes'));
  server.route(require('./routes/nurseRoutes'));

  server.ext('onPreResponse', errorHandler);

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
