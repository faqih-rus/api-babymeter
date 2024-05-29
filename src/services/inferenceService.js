const tflite = require('tflite-node');

async function predictClassification(model, imageBuffer, measurements) {
    try {
        // Decode and preprocess image
        const tensor = tflite.node
            .decodeImage(imageBuffer, 224, 224, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims(0)
            .toFloat();

        // Get image prediction output
        const imageOutput = model.predict(tensor);
        const imageScore = imageOutput.dataSync();
        const imageConfidence = Math.max(...imageScore) * 100;

        const { headCircumference, armCircumference, abdomenCircumference, chestCircumference, height } = measurements;

        // Combine image model output with physical measurements
        const combinedScore = calculateCombinedScore(imageScore, measurements);

        // Determine classification label
        const classes = ['Sehat', 'Stunting Stadium 1', 'Stunting Stadium 2'];
        const classResult = tflite.argMax(combinedScore, 1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;
        if (label === 'Sehat') {
            suggestion = 'Bayi Anda sehat. Lanjutkan pemberian gizi yang baik dan pemeriksaan rutin.';
        } else if (label === 'Stunting Stadium 1') {
            suggestion = 'Bayi Anda mengalami stunting stadium 1. Disarankan untuk konsultasi dengan ahli gizi dan dokter anak.';
        } else if (label === 'Stunting Stadium 2') {
            suggestion = 'Bayi Anda mengalami stunting stadium 2. Segera konsultasi dengan dokter anak untuk penanganan lebih lanjut.';
        }

        return {
            label,
            confidence: imageConfidence,
            suggestion
        };
    } catch (error) {
        console.error('Error in prediction:', error);
        throw error;
    }
}

function calculateCombinedScore(imageScore, measurements) {
    const weights = {
        headCircumference: 0.2,
        armCircumference: 0.2,
        abdomenCircumference: 0.2,
        chestCircumference: 0.2,
        height: 0.2
    };

    const measurementScore = (measurements.headCircumference * weights.headCircumference) +
        (measurements.armCircumference * weights.armCircumference) +
        (measurements.abdomenCircumference * weights.abdomenCircumference) +
        (measurements.chestCircumference * weights.chestCircumference) +
        (measurements.height * weights.height);

    const combinedScore = imageScore.map((score, index) => score + measurementScore * weights[index]);

    return combinedScore;
}

module.exports = {
    predictClassification
};
