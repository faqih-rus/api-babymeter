const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const authRoutes = require('../auth/authRoutes');
const loadModel = require('../services/loadModel');
const { db } = require('../config/firebaseConfig');

const init = async () => {
    const port = process.env.PORT || 3000;
    const server = Hapi.server({
        port: port,
        host: 'localhost',
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

    // Memuat model dan menyimpannya dalam server.app agar dapat diakses oleh handler
    try {
        const model = await loadModel();
        server.app.model = model;
    } catch (error) {
        console.error('Error loading model:', error);
        process.exit(1);
    }

    // Menyusun rute termasuk rute autentikasi
    server.route([...authRoutes, ...routes]);

    // Ekstensi onPreResponse untuk logging kesalahan
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response instanceof Error) {
            console.error('Response Error:', response);
        }
        return h.continue;
    });

    // Memulai server
    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

// Menangani penolakan tidak tertangani
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

init();
