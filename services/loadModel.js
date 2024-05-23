const fs = require('fs');
const tflite = require('tflite-node');

async function loadModel() {
    const modelPath = process.env.TFLITE_MODEL_PATH;
    if (!modelPath) {
        throw new Error('TFLITE_MODEL_PATH environment variable is not set');
    }
    const modelBuffer = fs.readFileSync(modelPath);
    const model = new tflite.Interpreter(modelBuffer);
    model.allocateTensors();
    return model;
}

module.exports = loadModel;
