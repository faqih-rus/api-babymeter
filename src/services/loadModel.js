const tf = require('@tensorflow/tfjs-node');
const path = require('path');
require('dotenv').config();

async function loadModel() {
    try {
        const modelPath = path.resolve(__dirname, process.env.MODEL_URL);
        const model = await tf.loadLayersModel(`file://${modelPath}`);
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;
