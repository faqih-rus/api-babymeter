const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const authRoutes = require('../auth/authRoutes');
const loadModel = require('../services/loadModel');

const init = async () => {
    const port = process.env.PORT || 3000;  
    const server = Hapi.server({
        port: 3000,
        host: port,
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            },
            payload: {
                allow: 'multipart/form-data',
                parse: true,
                output: 'data',
                maxBytes: 5 * 1024 * 1024
            }
        }
    });

    const model = await loadModel();
    server.app.model = model;

    server.route([...authRoutes, ...routes]);

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;

        if (response instanceof Error) {
            console.log(response);
        }
        return h.continue;
    });

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
});

init();
