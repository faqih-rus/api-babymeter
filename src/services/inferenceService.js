const tf = require('@tensorflow/tfjs-node');

async function predictClasification (model, imageBuffer,measurements){
    try {
        const imageTensor = tf.node
        .decodeImage(imageBuffer)
        .resizeNearestNeighboor(224,224)
        .toFloat()
        .expandDims();
        
        const normalizedImageTensor = imageTensor.div(255.0);
        
        const measurementTensor = tf.tensor2d([
            [
                measurements.headCircumference,
                measurements.armCircumference,
                measurements.abdomenCircumference,
                measurements.chestCircumference,
                measurements.height
            ]
        ]);

        const combinedTensor = tf.concat([normalizedImageTensor.flatten(), measurementTensor], 1);

        const prediction = model.predict(combinedTensor);
        const score = await prediction.data();
        const confidentScore = Math.max(...score) * 100;

        const classes = [
            'Sehat',
            'Stunting Stadium 1',
            'Stunting Stadium 2'
        ]
        const classResult = tf.argMax(prediction,1).dataSync()[0];
        const label = classes[classResult];

        let suggestion;

        if (label === 'Sehat') {
            suggestion = 'Bayi Anda sehat. Lanjutkan pemberian gizi yang baik dan pemeriksaan rutin.';
        } else if (label === 'Stunting Stadium 1') {
            suggestion = 'Bayi Anda mengalami stunting stadium 1. Disarankan untuk konsultasi dengan ahli gizi dan dokter anak.';
        } else if (label === 'Stunting Stadium 2') {
            suggestion = 'Bayi Anda mengalami stunting stadium 2. Segera konsultasi dengan dokter anak untuk penanganan lebih lanjut.';
        }

        return { confidentScore, label, suggestion };
    } catch (error) {
        console.error('Error during prediction:', error);
        throw error;
    }      
}

module.exports = { predictClasification }

