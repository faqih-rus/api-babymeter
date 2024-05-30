const authController = require('./authController');
const authValidation = require('./authValidation');

module.exports = [
    {
        method: 'POST',
        path: '/auth/register',
        handler: authController.register,
        options: {
            validate: {
                payload: authValidation.register
            }
        }
    },
    {
        method: 'POST',
        path: '/auth/login',
        handler: authController.login,
        options: {
            validate: {
                payload: authValidation.login
            }
        }
    }
];
