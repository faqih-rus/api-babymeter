const { savePrediction, getPredictions, updatePrediction, updateProfile } = require('../services/nurseService');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// const createPrediction = async (request, h) => {
//     try {
//         const { imageUrl, babyName, age, weight, id } = request.payload;
//         const response = await axios.post('URL_MLNYA', { imageUrl });

//         if (response.status !== 200) {
//             throw new Error('Failed to get prediction from ML model');
//         }

//         const { lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan } = response.data;

//         if (![lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan].every(value => value !== undefined)) {
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
//             id,
//             babyName,
//             age,
//             weight,
//             lingkar_kepala,
//             lingkar_dada,
//             lingkar_lengan,
//             lingkar_perut,
//             lingkar_paha,
//             panjang_badan,
//             prediction,
//             confidence: 0.95,
//             suggestion,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         };

//         await savePrediction(request.auth.credentials.uid, predictionData);

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
        return h.response({ status: 'success', data: predictions }).code(200);
    } catch (error) {
        console.error('Error fetching predictions:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

const modifyPrediction = async (request, h) => {
    try {
        const { id } = request.params;
        const updateData = request.payload;
        const userId = request.auth.credentials.uid;

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
        const updateData = request.payload;

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
