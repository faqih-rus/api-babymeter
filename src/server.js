// server.js
'use strict';

require('dotenv').config();
const Hapi = require('@hapi/hapi');
// const admin = require('firebase-admin');
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
  ]);

  await server.register({
    plugin: corsHandler
  });

  await server.register(require('./middleware/authMiddleware.js'));

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
