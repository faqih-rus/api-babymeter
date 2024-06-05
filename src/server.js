'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./config/firebaseConfig');
const errorHandler = require('./utils/errorHandler');

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://capstone-babymeter-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT || 3000,
        host: 'localhost'
    });

    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('hapi-auth-jwt2'));

    // Configure JWT authentication
    server.auth.strategy('jwt', 'jwt', {
        key: process.env.JWT_SECRET, // Use your own secret key here
        validate: async (decoded, request, h) => {
            // Perform your validation logic here
            return { isValid: true };
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
