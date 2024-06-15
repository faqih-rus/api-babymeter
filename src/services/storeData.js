// // const { Firestore } = require('@google-cloud/firestore');


// // async function storeData(id, data) {
// //   // Authenticate with Firestore
// //   const db = new Firestore({
// //     projectId: 'capstone-babymeter',
// //   });

// //   const predictCollection = db.collection('predictions');
// //   return predictCollection.doc(id).set(data);
// // }

// // module.exports = { storeData };

// // FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)
// //     .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
// //         @Override
// //         public void onComplete(@NonNull Task<AuthResult> task) {
// //             if (task.isSuccessful()) {
// //                 FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
// //                 user.getIdToken(true)
// //                     .addOnCompleteListener(new OnCompleteListener<GetTokenResult>() {
// //                         @Override
// //                         public void onComplete(@NonNull Task<GetTokenResult> task) {
// //                             if (task.isSuccessful()) {
// //                                 String idToken = task.getResult().getToken();
// //                                 // Kirim token ini ke server backend untuk proses registrasi
// //                             } else {
// //                                 // Handle error -> task.getException()
// //                             }
// //                         }
// //                     });
// //             } else {
// //                 // Handle error -> task.getException()
// //             }
// //         }
// //     });


// const { Firestore } = require('@google-cloud/firestore')

// const firestore = new Firestore({
//     projectId: process.env.GOOGLE_CLOUD_PROJECT,
//     databaseId: "babymeter"
// })

// async function storeData(collectionName, id, data) {
//     try {
//         // Validate collection name
//         if (collectionName !== 'nurse' && collectionName !== 'baby') {
//             throw new Error("Invalid collection name. Must be 'users' or 'recipes'")
//         }

//         const collectionRef = firestore.collection(collectionName)
//         await collectionRef.doc(id).set(data)

//         console.log(`Data successfully stored in collection '${collectionName}' with ID: ${id}`)
//     } catch (error) {
//         console.error(`Error storing data in collection '${collectionName}':`, error)
//         throw error // Re-throw for further error handling
//     }
// }


// module.exports = { firestore, storeData }


// const createPrediction = async (request, h) => {
//     try {
//         const { imageUrl, babyName, age, weight, id } = request.payload;
//         // Hardcode data prediksi
//         const [lingkar_kepala, lingkar_dada, lingkar_lengan, lingkar_perut, lingkar_paha, panjang_badan] = [20, 10, 5, 10, 15, 20];
//         const userId = request.auth.credentials.uid;

//         if (!lingkar_kepala || !lingkar_dada || !lingkar_lengan || !lingkar_perut || !lingkar_paha || !panjang_badan) {
//             throw new Error('Data prediksi tidak lengkap');
//         }

//         const existingPrediction = await getPredictions(userId,id);
//         if (existingPrediction) {
//             return h.response({ status: 'error', message: 'Prediction ID already exists' }).code(400);
//         }

//         // Konversi panjang_badan dari cm ke meter
//         const panjangBadanMeter = panjang_badan / 100;

//         // Hitung BMI
//         const bmi = weight / (panjangBadanMeter * panjangBadanMeter);

//         // Menentukan status pertumbuhan dan saran berdasarkan nilai BMI
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
//             id: id,
//             babyName: babyName,
//             age: age,
//             weight: weight,
//             lingkar_kepala: lingkar_kepala,
//             lingkar_dada: lingkar_dada,
//             lingkar_lengan: lingkar_lengan,
//             lingkar_perut: lingkar_perut,
//             lingkar_paha: lingkar_paha,
//             panjang_badan: panjang_badan,
//             prediction: prediction,
//             confidence: 0.95,

//             suggestion: suggestion,
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString()
//         };

//         await savePrediction(userId, predictionData);
//         return h.response({ status: 'success', data: predictionData }).code(201);
//     } catch (error) {
//         console.error('Error creating prediction:', error);
//         return h.response({ status: 'error', message: 'Internal Server Error' }).code(500);
//     }
// };