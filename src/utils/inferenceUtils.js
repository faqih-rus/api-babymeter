const { getStuntingThresholds } = require('./stuntingUtils');

const performInference = (age, weight, panjang_badan, mlResult) => {
    const panjangBadanMeter = panjang_badan / 100;
    const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

    let prediction = "Normal";
    let suggestion = "Pertumbuhan normal.";
    let confidence = 0.95;

    if (bmi < 14) {
        prediction = "Di Bawah Normal";
        suggestion = "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.";
    } else if (bmi > 17) {
        prediction = "Obesitas";
        suggestion = "Perhatikan asupan makanan dan aktivitas fisik bayi.";
    }

    const stuntingThresholds = getStuntingThresholds(age);

    if (stuntingThresholds && panjang_badan < stuntingThresholds) {
        prediction = "Stunting";
        suggestion = "Tinggi badan bayi berada di bawah standar. Konsultasikan dengan dokter untuk penanganan lebih lanjut.";
    }

    return { prediction, suggestion, confidence };
};

module.exports = { performInference };
