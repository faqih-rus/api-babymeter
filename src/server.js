// src/server.js
'use strict';
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
const errorHandler = require('./utils/errorHandler');
const corsHeaders = require('hapi-cors-headers');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('hapi-auth-jwt2'));

    // Configure CORS
    server.ext('onPreResponse', corsHeaders);

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