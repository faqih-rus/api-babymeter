const Joi = require('joi');
const {
  createPrediction,
  getPredictionData,
  modifyPrediction,
  updateNurseProfile,
  getPredictionByIdHandler,
  deletePredictionHandler
} = require('../controllers/nurseController');

module.exports = [
  {
    method: 'POST',
    path: '/nurse/predictions',
    options: {
      auth: 'default',
      payload: {
        output: 'stream',
        parse: true,
        multipart: true
      },
      validate: {
        payload: Joi.object({
          babyName: Joi.string().required(),
          age: Joi.number().integer().required(),
          weight: Joi.number().required(),
          id: Joi.string().required(),
          image: Joi.any().required()
        })
      }
    },
    handler: createPrediction
  },
  {
    method: 'GET',
    path: '/nurse/predictions',
    handler: getPredictionData
  },
  {
    method: 'PUT',
    path: '/nurse/predictions/{id}',
    options: {
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        payload: Joi.object({
          babyName: Joi.string().optional(),
          id: Joi.string().optional(),
          weight: Joi.number().optional()
        })
      }
    },
    handler: modifyPrediction
  },
  {
    method: 'PUT',
    path: '/nurse/profile',
    options: {
      auth: 'default',
      payload: {
        output: 'stream',
        parse: true,
        multipart: true
      },
      validate: {
        payload: Joi.object({
          name: Joi.string().optional(),
          password: Joi.string().min(6).optional(),
          profileImage: Joi.any().optional()
        })
      }
    },
    handler: updateNurseProfile
  },
  {
    method: 'GET',
    path: '/nurse/predictions/{id}',
    handler: getPredictionByIdHandler
  },
  {
    method: 'DELETE',
    path: '/nurse/predictions/{id}',
    handler: deletePredictionHandler
  }
];
