// authController.js
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require("firebase/auth");
const { doc, setDoc, updateDoc } = require("firebase/firestore");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("firebase/storage");
const firebaseApp = require("../config/firebaseConfig.js");
const { db } = require("../config/firebaseConfig.js");
const { v4: uuidv4 } = require('uuid');
const auth = getAuth(firebaseApp.firebaseApp);
const storage = getStorage(firebaseApp.firebaseApp);

exports.register = async (request, h) => {
  try {
    const { email, password, name } = request.payload;

    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const data = {
      name: name,
      profileImageUrl: "https://storage.googleapis.com/asset-design/profile-image/Cuplikan%20layar%202024-06-11%20230353.png"
    };

    const docRef = doc(db, "Users", user.uid);
    await setDoc(docRef, data);

    return h.response({
      status: 201,
      message: "Registration successful!",
    }).code(201);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return h.response({
        status: 409,
        message: "Email already registered!",
      }).code(409);
    } else {
      console.error(error.message);
      return h.response({
        status: 500,
        message: "An error occurred during signup.",
      }).code(500);
    }
  }
};

exports.login = async (request, h) => {
  const { email, password } = request.payload;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const idToken = await user.getIdToken();

    return h.response({
      status: 200,
      message: "Login successful",
      idToken,
    }).code(200);
  } catch (error) {
    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      return h.response({
        status: 401,
        message: "Invalid email or password.",
      }).code(401);
    } else {
      console.error(error.message);
      return h.response({
        status: 500,
        message: "An error occurred during login.",
      }).code(500);
    }
  }
};

exports.logout = async (request, h) => {
  try {
    await signOut(auth);
    return h.response({
      status: 200,
      message: "Logout successful.",
    }).code(200);
  } catch (error) {
    console.error(error.message);
    return h.response({
      status: 500,
      message: "Logout failed. Please try again.",
    }).code(500);
  }
};

exports.updateProfile = async (request, h) => {
  try {
    const userId = request.auth.credentials.uid;
    const { name, password, profileImage } = request.payload;

    let updateData = {
      ...(name && { name }),
      ...(password && { password })
    };

    if (profileImage) {
      const storageRef = ref(storage, `profiles/${userId}/${uuidv4()}`);
      const snapshot = await uploadBytes(storageRef, Buffer.from(profileImage, 'base64'));
      const downloadURL = await getDownloadURL(snapshot.ref);
      updateData.profileImageUrl = downloadURL;
    }

    const userDocRef = doc(db, "Users", userId);
    await updateDoc(userDocRef, updateData);

    const updatedUserDoc = await getDoc(userDocRef);
    return h.response({ status: 'success', data: updatedUserDoc.data() }).code(200);
  } catch (error) {
    console.error('Error updating profile:', error);
    return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
  }
};
