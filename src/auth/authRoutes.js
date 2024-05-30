const { registerHandler, loginHandler } = require('./authController');

const routes = [
    {
        method: 'POST',
        path: '/auth/register',
        handler: registerHandler
    },
    {
        method: 'POST',
        path: '/auth/login',
        handler: loginHandler
    }
];

module.exports = routes;
