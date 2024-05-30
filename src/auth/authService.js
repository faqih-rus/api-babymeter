const firebase = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async ({ email, password, role, nik }) => {
    const userRecord = await firebase.auth().createUser({
        email,
        password,
    });

    const userId = userRecord.uid;
    await firebase.firestore().collection('users').doc(userId).set({
        email,
        role,
        nik,
    });

    return { userId, email, role, nik };
};

const login = async ({ email, password }) => {
    const userRecord = await firebase.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    const userSnapshot = await firebase.firestore().collection('users').doc(userId).get();
    const user = userSnapshot.data();

    const token = jwt.sign(
        { userId: userId, email: user.email, role: user.role, nik: user.nik },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return token;
};

module.exports = {
    register,
    login
};
