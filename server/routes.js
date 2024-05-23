const { 
    getPredictionsHandler,
    postPredictionsHandler, 
    editPredictionsHandler
} = require('./handler');

const routes = [
    {
        method: 'POST',
        path: '/baby',
        handler: postPredictionsHandler
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