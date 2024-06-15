// // routes.js
// const nurseController = require('./controllers/nurseController.js');
// const authController = require('./controllers/authController.js');
// const { verifyToken } = require('./middleware/authMiddleware');

// const routes = [
//   {
//     method: 'POST',
//     path: '/register',
//     handler: authController.register
//   },
//   {
//     method: 'POST',
//     path: '/login',
//     handler: authController.login
//   },
//   {
//     method: 'POST',
//     path: '/logout',
//     handler: authController.logout
//   },
//   {
//     method: 'POST',
//     path: '/profile/update',
//     handler: nurseController.updateNurseProfile,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   },
//   {
//     method: 'POST',
//     path: '/predict',
//     handler: nurseController.createPrediction,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   },
//   {
//     method: 'GET',
//     path: '/predictions',
//     handler: nurseController.getPredictionData,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   },
//   {
//     method: 'GET',
//     path: '/prediction/{id}',
//     handler: nurseController.getPredictionByIdHandler,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   },
//   {
//     method: 'PUT',
//     path: '/prediction/{id}',
//     handler: nurseController.modifyPrediction,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   },
//   {
//     method: 'DELETE',
//     path: '/prediction/{id}',
//     handler: nurseController.removePrediction,
//     options: {
//       pre: [{ method: verifyToken }]
//     }
//   }
// ];

// module.exports = routes;
