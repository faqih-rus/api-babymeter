const { auth } = require('../config/firebaseConfig');
const { ClientError } = require('../exceptions/ClientError');

async function register({ email, password, role, nik }) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Optional: Save additional user data in Firestore
        await auth.currentUser.updateProfile({
            displayName: role,
            photoURL: nik || null,
        });

        return { email: user.email, uid: user.uid };
    } catch (error) {
        throw new ClientError(error.message);
    }
}

async function login({ email, password }) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const token = await userCredential.user.getIdToken();
        return token;
    } catch (error) {
        throw new ClientError(error.message);
    }
}

module.exports = { register, login };
