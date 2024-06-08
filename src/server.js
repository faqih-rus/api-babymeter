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

  // Register plugins for serving static files and views
  await server.register([
    require('@hapi/inert'),
    require('@hapi/vision'),
  ]);

  // Register CORS handler plugin
  await server.register({
    plugin: corsHandler
  });

  // Register custom Firebase authentication middleware
  await server.register(require('./middleware/authMiddleware.js'));

  // Register routes
  server.route(require('./routes/authRoutes'));
  server.route(require('./routes/nurseRoutes'));

  // Add error handling extension
  server.ext('onPreResponse', errorHandler);

  // Start the server
  await server.start();
  console.log(`Server running on %s`, server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
