'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const errorHandler = require('./utils/errorHandler');
const corsHandler = require('./utils/corsHandler');

// Read the service account key JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/config/capstone-babymeter-firebase-adminsdk-f1kgg-1bf92a891c.json'), 'utf8')
);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://capstone-babymeter-default-rtdb.asia-southeast1.firebasedatabase.app"
});

// Initialize the Firebase Admin SDK
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost'
  });

  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
    require('hapi-auth-jwt2'),
    {
      plugin: corsHandler
    }
  ]);

  // Configure JWT authentication
  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET, // Use your own secret key here
    validate: async (decoded, request, h) => {
      // Perform your validation logic here
      try {
        const firebaseUser = await firebaseAdmin.auth().getUser(decoded.uid);
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

  // Register routes
  server.route(require('./routes/authRoutes'));
  server.route(require('./routes/nurseRoutes'));

  // Register error handler
  server.ext('onPreResponse', errorHandler);

  await server.start();
  console.log(`Server running on %s`, server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();