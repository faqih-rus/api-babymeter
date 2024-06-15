const getStuntingThresholds = (age) => {
    const thresholds = {
        0: 49.9,
        1: 54.7,
        2: 58.4,
        3: 61.4,
        4: 64.0,
        5: 66.4,
        6: 68.6,
        7: 70.5,
        8: 72.3,
        9: 73.9,
        10: 75.4,
        11: 76.8,
        12: 78.0,
    };
    return thresholds[age];
};

module.exports = { getStuntingThresholds };