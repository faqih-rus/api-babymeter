const { database } = require('../config/firebaseConfig');

async function storePredictionData(data) {
    try {
        const newPredictionRef = database.ref('predictions').push();
        await newPredictionRef.set({
            name: data.name,
            age: data.age,
            weight: data.weight,
            height: data.height,
            headCircumference: data.headCircumference,
            armCircumference: data.armCircumference,
            abdomenCircumference: data.abdomenCircumference,
            chestCircumference: data.chestCircumference,
            prediction: data.prediction,
            confidence: data.confidence,
            suggestion: data.suggestion,
            createdAt: new Date().toISOString()
        });
        console.log('Prediction data stored successfully');
    } catch (error) {
        console.error('Error storing prediction data:', error);
        throw error;
    }
}

module.exports = storePredictionData;
