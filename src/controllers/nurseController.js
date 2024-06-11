const { savePrediction, getPredictions, getPredictionById, updatePrediction, updateProfile } = require('../services/nurseService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// const createPrediction = async (request, h) => {
//     try {
//         const { imageUrl, babyName, age, weight, id } = request.payload;
//         const userId = request.auth.credentials.uid;

//         const existingPrediction = await getPredictionById(userId, id);
//         if (existingPrediction) {
//             return h.response({ status: 'error', message: 'Prediction ID already exists' }).code(400);
//         }

//         console.log("Sending image URL to Flask server for processing...");
//         const response = await axios.post('http://192.168.1.15:5000/predictions', {
//             imageUrl: imageUrl
//         });

//         console.log("Received response from Flask server.");
//         const mlResult = response.data;

//         const { lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan } = mlResult;

//         if (!lingkar_kepala || !lingkar_dada || !lingkar_lengan || !lingkar_perut || !lingkar_paha || !panjang_badan) {
//             throw new Error('Incomplete prediction data');
//         }

//         const panjangBadanMeter = panjang_badan / 100;
//         const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

//         let prediction = "Normal";
//         let suggestion = "Pertumbuhan normal.";

//         if (bmi < 14) {
//             prediction = "Di Bawah Normal";
//             suggestion = "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.";
//         } else if (bmi > 17) {
//             prediction = "Di Atas Normal";
//             suggestion = "Perhatikan asupan makanan dan aktivitas fisik bayi.";
//         }

//         const predictionData = {
//             id: id,
//             babyName: babyName,
//             age: age,
//             weight: weight,
//             lingkar_kepala: lingkar_kepala,
//             lingkar_dada: lingkar_dada,
//             lingkar_lengan: lingkar_lengan,
//             lingkar_perut: lingkar_perut,
//             lingkar_paha: lingkar_paha,
//             panjang_badan: panjang_badan,
//             prediction: prediction,
//             confidence: 0.95,
//             suggestion: suggestion,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         };

//         await savePrediction(userId, predictionData);
//         return h.response({ status: 'success', data: predictionData }).code(201);
//     } catch (error) {
//         console.error('Error creating prediction:', error);
//         return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
//     }
// };

const createPrediction = async (request, h) => {
    try {
        const { imageUrl, babyName, age, weight, id } = request.payload;
        // Hardcode data prediksi
        const [lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan] = [20, 10, 5, 10, 15, 20];
        const userId = request.auth.credentials.uid;

        if (!lingkar_kepala || !lingkar_dada || !lingkar_lengan || !lingkar_perut || !lingkar_paha || !panjang_badan) {
            throw new Error('Data prediksi tidak lengkap');
        }

        const existingPrediction = await getPredictionById(userId,id);
        if (existingPrediction) {
            return h.response({ status: 'error', message: 'Prediction ID already exists' }).code(400);
        }

        // Konversi panjang_badan dari cm ke meter
        const panjangBadanMeter = panjang_badan / 100;

        // Hitung BMI
        const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

        // Menentukan status pertumbuhan dan saran berdasarkan nilai BMI
        let prediction = "Normal";
        let suggestion = "Pertumbuhan normal.";

        if (bmi < 14) {
            prediction = "Di Bawah Normal";
            suggestion = "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.";
        } else if (bmi > 17) {
            prediction = "Di Atas Normal";
            suggestion = "Perhatikan asupan makanan dan aktivitas fisik bayi.";
        }

        const predictionData = {
            id: id,
            babyName: babyName,
            age: age,
            weight: weight,
            lingkar_kepala: lingkar_kepala,
            lingkar_dada: lingkar_dada,
            lingkar_lengan: lingkar_lengan,
            lingkar_perut: lingkar_perut,
            lingkar_paha: lingkar_paha,
            panjang_badan: panjang_badan,
            prediction: prediction,
            confidence: 0.95,

            suggestion: suggestion,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        await savePrediction(userId, predictionData);
        return h.response({ status: 'success', data: predictionData }).code(201);
    } catch (error) {
        console.error('Error creating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const getPredictionData = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const predictions = await getPredictions(userId);

        if (!predictions || predictions.length === 0) {
            console.warn('No predictions found for user:', userId);
            return h.response({ status: 'success', data: [] }).code(200);
        }

        return h.response({ status: 'success', data: predictions }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const modifyPrediction = async (request, h) => {
    try {
        const { id } = request.params;
        const { id: newId, weight } = request.payload;
        const userId = request.auth.credentials.uid;

        const updateData = {
            ...(newId && { id: newId }), 
            ...(weight && { weight: weight }) 
        };

        const updatedPrediction = await updatePrediction(userId, id, updateData);
        return h.response({ status: 'success', data: updatedPrediction }).code(200);
    } catch (error) {
        console.error('Error updating prediction:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const updateNurseProfile = async (request, h) => {
    try {
        const userId = request.auth.credentials.uid;
        const { name, password } = request.payload;

        const updateData = {
            ...(name && { name }),       
            ...(password && { password })
        };

        const updatedProfile = await updateProfile(userId, updateData);
        return h.response({ status: 'success', data: updatedProfile }).code(200);
    } catch (error) {
        console.error('Error updating profile:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};


module.exports = {
    createPrediction,
    getPredictionData,
    modifyPrediction,
    updateNurseProfile
};

module.exports = {
    createPrediction,
    getPredictionData,
    modifyPrediction,
    updateNurseProfile
};
