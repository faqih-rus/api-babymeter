const { 
    getPredictionsHandler,
    postPredictionsHandler, 
    editPredictionsHandler
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/baby',
        handler: postPredictionsHandler,
        options: {
            payload : {
                allow: 'multipart/form-data',
                parse: true,
                output: 'data',
                maxBytes: 5 * 1024 * 1024
            }
        }
    },
    {
        method: 'GET',
        path: '/baby',
        handler: getPredictionsHandler
    },
    {
        method: 'PUT',
        path: '/baby',
        handler: editPredictionsHandler
    }
]

module.exports = routes;