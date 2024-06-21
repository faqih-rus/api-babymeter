const Joi = require('joi');
const {
  createPrediction,
  getPredictionData,
  modifyPrediction,
  getPredictionByIdHandler,
  deletePredictionHandler
} = require('../controllers/nurseController');

module.exports = [
  {
    method: 'POST',
    path: '/nurse/predictions',
    options: {
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
          nik: Joi.string().required(),
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
    path: '/nurse/predictions/{nik}',
    options: {
      validate: {
        params: Joi.object({
          nik: Joi.string().required()
        }),
        payload: Joi.object({
          babyName: Joi.string().optional(),
          nik: Joi.string().optional(),
          weight: Joi.number().optional()
        })
      }
    },
    handler: modifyPrediction
  },
  {
    method: 'GET',
    path: '/nurse/predictions/{nik}',
    handler: getPredictionByIdHandler
  },
  {
    method: 'DELETE',
    path: '/nurse/predictions/{nik}',
    handler: deletePredictionHandler
  }
];
