module.exports = {
    name: 'corsHandler',
    version: '1.0.0',
    register: async function (server, options) {
        server.ext('onPreResponse', (request, h) => {
            const response = request.response.isBoom ? request.response.output : request.response;
            response.headers['access-control-allow-origin'] = '*';
            response.headers['access-control-allow-credentials'] = 'true';
            response.headers['access-control-allow-headers'] = 'Origin, Content-Type, Accept';
            response.headers['access-control-allow-methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            
            return h.continue;
        });
    }
};
