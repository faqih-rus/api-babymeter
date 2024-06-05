// src/server.js
'use strict';
require('dotenv').config();
const Hapi = require('@hapi/hapi');
const firebaseAdmin = require('firebase-admin');
const errorHandler = require('./utils/errorHandler');
const corsHeaders = require('hapi-cors-headers');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const nurseRoutes = require('./routes/nurseRoutes');
require('./config/firebaseConfig'); // Pastikan firebaseConfig sudah diimpor

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    try {
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
        server.route(authRoutes);
        server.route(nurseRoutes);

        // Register error handler
        server.ext('onPreResponse', errorHandler);

        await server.start();
        console.log(`Server running on %s`, server.info.uri);
    } catch (error) {
        console.error('Error starting server:', error);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();
