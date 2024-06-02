const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, imageBuffer, measurements) {
    try {
        const imageTensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        const normalizedImageTensor = imageTensor.div(255.0);

        const measurementTensor = tf.tensor2d([[
            measurements.headCircumference,
            measurements.armCircumference,
            measurements.abdomenCircumference,
            measurements.chestCircumference,
            measurements.height
        ]]);

        const flattenedImageTensor = normalizedImageTensor.reshape([1, 224 * 224 * 3]);
        const combinedTensor = tf.concat([flattenedImageTensor, measurementTensor], 1);

        const prediction = model.predict(combinedTensor);
        const score = await prediction.data();
        const confidenceScore = Math.max(...score) * 100;

        const classes = ['Sehat', 'Stunting Stadium 1', 'Stunting Stadium 2'];
        const classResult = tf.argMax(prediction, 1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;

        switch (label) {
            case 'Sehat':
                suggestion = 'Bayi Anda sehat. Lanjutkan pemberian gizi yang baik dan pemeriksaan rutin.';
                break;
            case 'Stunting Stadium 1':
                suggestion = 'Bayi Anda mengalami stunting stadium 1. Disarankan untuk konsultasi dengan ahli gizi dan dokter anak.';
                break;
            case 'Stunting Stadium 2':
                suggestion = 'Bayi Anda mengalami stunting stadium 2. Segera konsultasi dengan dokter anak untuk penanganan lebih lanjut.';
                break;
            default:
                suggestion = 'Tidak dapat menentukan hasil. Silakan coba lagi.';
                break;
        }

        return { confidenceScore, label, suggestion };
    } catch (error) {
        console.error('Error during prediction:', error);
        throw error;
    }
}

module.exports = { predictClassification };
