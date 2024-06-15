const { getStuntingThresholds, getWHOPercentile } = require('./stuntingUtils');

const performInference = (age, weight, panjang_badan, mlResult) => {
    const panjangBadanMeter = panjang_badan / 100;
    const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

    let prediction = "Normal";
    let suggestion = "Pertumbuhan normal.";
    let confidence = 0.95;

    // Perhitungan BMI
    if (bmi < 14) {
        prediction = "Di Bawah Normal";
        suggestion = "Konsultasikan dengan dokter anak untuk evaluasi lebih lanjut.";
        confidence = 0.9; 
    } else if (bmi > 17) {
        prediction = "Obesitas";
        suggestion = "Perhatikan asupan makanan dan aktivitas fisik bayi.";
        confidence = 0.9;
    }

    const stuntingThresholds = getStuntingThresholds(age);
    const whoPercentile = getWHOPercentile(age, panjang_badan);

    if (stuntingThresholds && panjang_badan < stuntingThresholds) {
        prediction = "Stunting";
        suggestion = "Tinggi badan bayi berada di bawah standar. Konsultasikan dengan dokter untuk penanganan lebih lanjut.";
        confidence = 0.95; 
    }

    if (whoPercentile < 5) {
        prediction = "Stunting";
        suggestion = "Tinggi badan bayi sangat rendah untuk usianya. Perlu konsultasi lebih lanjut dengan dokter.";
        confidence = 0.98; 
    }

    return { prediction, suggestion, confidence };
};

module.exports = { performInference };
