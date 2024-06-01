const { db } = require('../config/firebaseConfig.js');

async function storeData(id, data) {
    try {
        const predictCollection = db.collection('predictions');
        await predictCollection.doc(id).set(data);
        return { status: 'success', message: 'Data stored successfully' };
    } catch (error) {
        console.error('Error storing data:', error);
        throw new Error('Failed to store data');
    }
}

module.exports = { storeData };
