const tflite = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function loadModel() {
    try {
        const modelPath = path.resolve(__dirname, process.env.MODEL_URL);
        const modelBuffer = fs.readFileSync(modelPath);
        const model = await tflite.loadGraphModel(tf.io.fromBuffer(modelBuffer));

        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw error;
    }
}

module.exports = loadModel;
