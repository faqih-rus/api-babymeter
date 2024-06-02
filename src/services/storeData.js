const { db } = require('../config/firebaseConfig');

async function storeData(data) {
    try {
        const predictCollection = db.collection('predictions');
        await predictCollection.add(data);
        return { status: 'success', message: 'Data stored successfully' };
    } catch (error) {
        console.error('Error storing data:', error);
        throw new Error('Failed to store data');
    }
}

module.exports = { storeData };
