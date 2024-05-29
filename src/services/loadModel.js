const tflite = require('tflite-node');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function loadModel() {
    try {
        const modelPath = path.resolve(__dirname, process.env.MODEL_URL);
        const modelBuffer = fs.readFileSync(modelPath);
        const model = tflite.loadModel(modelBuffer);

        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;
