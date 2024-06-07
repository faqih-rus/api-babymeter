// const { Firestore } = require('@google-cloud/firestore');


// async function storeData(id, data) {
//   // Authenticate with Firestore
//   const db = new Firestore({
//     projectId: 'capstone-babymeter',
//   });

//   const predictCollection = db.collection('predictions');
//   return predictCollection.doc(id).set(data);
// }

// module.exports = { storeData };

// FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password)
//     .addOnCompleteListener(new OnCompleteListener<AuthResult>() {
//         @Override
//         public void onComplete(@NonNull Task<AuthResult> task) {
//             if (task.isSuccessful()) {
//                 FirebaseUser user = FirebaseAuth.getInstance().getCurrentUser();
//                 user.getIdToken(true)
//                     .addOnCompleteListener(new OnCompleteListener<GetTokenResult>() {
//                         @Override
//                         public void onComplete(@NonNull Task<GetTokenResult> task) {
//                             if (task.isSuccessful()) {
//                                 String idToken = task.getResult().getToken();
//                                 // Kirim token ini ke server backend untuk proses registrasi
//                             } else {
//                                 // Handle error -> task.getException()
//                             }
//                         }
//                     });
//             } else {
//                 // Handle error -> task.getException()
//             }
//         }
//     });


const { Firestore } = require('@google-cloud/firestore')

const firestore = new Firestore({
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    databaseId: "babymeter"
})

async function storeData(collectionName, id, data) {
    try {
        // Validate collection name
        if (collectionName !== 'nurse' && collectionName !== 'baby') {
            throw new Error("Invalid collection name. Must be 'users' or 'recipes'")
        }

        const collectionRef = firestore.collection(collectionName)
        await collectionRef.doc(id).set(data)

        console.log(`Data successfully stored in collection '${collectionName}' with ID: ${id}`)
    } catch (error) {
        console.error(`Error storing data in collection '${collectionName}':`, error)
        throw error // Re-throw for further error handling
    }
}


module.exports = { firestore, storeData }