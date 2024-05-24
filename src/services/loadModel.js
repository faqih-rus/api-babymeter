const tflite = require('tflite-node');

async function loadModel(){
    const modelPath = process.env.TFLITE_MODEL_PATH;
    if (!modelPath) {
        throw new Error('TFLITE_MODEL_PATH environment variable is not set');
    }
    const model = new tflite.model(modelPath);
    return model;
}   

module.exports = {loadModel};