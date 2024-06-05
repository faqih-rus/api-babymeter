// src/controllers/authController.js
const admin = require('firebase-admin');

exports.register = async (request, h) => {
    const { token } = request.payload;

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        const userRef = admin.firestore().collection('nurses').doc(uid);
        await userRef.set({
            email,
            name,
            picture,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return h.response({
            status: 'success',
            message: 'User registered successfully',
            data: { uid, email, name, picture }
        }).code(201);
    } catch (error) {
        console.error('Error verifying token:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};

exports.login = async (request, h) => {
    const { email, password } = request.payload;

    try {
        const user = await admin.auth().getUserByEmail(email);
        const token = await admin.auth().createCustomToken(user.uid);
        return h.response({ token }).code(200);
    } catch (error) {
        console.error('Error logging in:', error);
        return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
    }
};
