#  BabyMeter 

![BabyMeter Logo](https://storage.googleapis.com/asset-design/logo/Untitled%20design%20(5).png)

BabyMeter adalah aplikasi yang digunakan untuk memonitor pertumbuhan dan kesehatan bayi dengan memanfaatkan Firebase Authentication untuk autentikasi, Firestore untuk penyimpanan data prediksi, dan Hapi.js sebagai framework backend. 🚀

## 🌟 Fitur Utama

- **📝 Register**: Perawat dapat mendaftar menggunakan Firebase Authentication.
- **🔑 Login**: Perawat dapat masuk ke aplikasi menggunakan Firebase Authentication.
- **🔮 Prediksi**: Aplikasi dapat membuat prediksi berdasarkan gambar yang diunggah.
- **💾 Simpan Prediksi**: Hasil prediksi disimpan di Firestore.
- **📊 Ambil Prediksi**: Data prediksi dapat diambil dari Firestore.
- **✏️ Edit Prediksi**: Prediksi yang sudah ada dapat diedit (berat dan tinggi badan).
- **👩‍⚕️ Perbarui Profil Perawat**: Perawat dapat memperbarui profil mereka.

## 📂 Struktur Folder

```
src
├── config/
│   ├── firebaseConfig.js
│   ├── config.js
├── controllers/
│   ├── authController.js
│   └── nurseController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   └── nurseRoutes.js
├── services/
│   └── nurseService.js
├── utils/
│   ├── inferenceUtils.js
│   ├── stuntingUtils.js
│   ├── corsHandler.js
│   ├── errorHandler.js
│   └── validators.js
├── server.js
├── package.json
├── .env
└── README.md
```

# BabyMeter API Documentation

BabyMeter adalah sebuah proyek yang menyediakan API untuk memantau dan memprediksi pertumbuhan bayi. API ini memungkinkan pengguna untuk mendaftar, masuk, membuat prediksi pertumbuhan bayi, dan mengelola profil mereka.

## Endpoints

### Authentication

1. **Register User**
   - **URL**: `/auth/register`
   - **Method**: `POST`
   - **Description**: Mendaftarkan pengguna baru.
   - **Request Payload**:
     ```json
     {
       "email": "string",
       "password": "string",
       "name": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "status": 201,
       "message": "Registration successful!"
     }
     ```

2. **Login User**
   - **URL**: `/auth/login`
   - **Method**: `POST`
   - **Description**: Login pengguna.
   - **Request Payload**:
     ```json
     {
       "email": "string",
       "password": "string"
     }
     ```
   - **Response**:
     ```json
     {
       "status": 200,
       "message": "Login successful",
       "idToken": "string"
     }
     ```

3. **Logout User**
   - **URL**: `/auth/logout`
   - **Method**: `POST`
   - **Description**: Logout pengguna.
   - **Response**:
     ```json
     {
       "status": 200,
       "message": "Logout successful."
     }
     ```

### Predictions

1. **Create Prediction**
   - **URL**: `/nurse/predictions`
   - **Method**: `POST`
   - **Description**: Membuat prediksi baru.
   - **Request Payload**:
     ```json
     {
       "userId": "string",
       "predictionData": {
         "age": "number",
         "babyName": "string",
         "confidence": "number",
         "createdAt": "string",
         "id": "string",
         "lingkar_dada": "number",
         "lingkar_kepala": "number",
         "lingkar_lengan": "number",
         "lingkar_paha": "number",
         "lingkar_perut": "number",
         "panjang_badan": "number",
         "prediction": "string",
         "suggestion": "string",
         "updatedAt": "string",
         "weight": "number"
       }
     }
     ```
   - **Response**:
     ```json
     {
       "status": "success",
       "message": "Prediction saved successfully"
     }
     ```

2. **Get Predictions**
   - **URL**: `/api/predictions/{id}`
   - **Method**: `GET`
   - **Description**: Mengambil semua prediksi untuk pengguna tertentu.
   - **Request Payload**:
     ```json
     {
       "image" : "multipart/form",
       "babyName" : "baby full name",
       "age" : "age in month",
       "weight" : "NIK (id) "
     }
     ```
   - **Response**:
     ```json
     [
       {
         "id": "string",
         "age": "number",
         "babyName": "string",
         "confidence": "number",
         "createdAt": "string",
         "lingkar_dada": "number",
         "lingkar_kepala": "number",
         "lingkar_lengan": "number",
         "lingkar_paha": "number",
         "lingkar_perut": "number",
         "panjang_badan": "number",
         "prediction": "string",
         "suggestion": "string",
         "updatedAt": "string",
         "weight": "number"
       }
     ]
     ```

3. **Update Prediction**
   - **URL**: `/nurse/predictions/{id}`
   - **Method**: `PUT`
   - **Description**: Memperbarui prediksi tertentu.
   - **Request Payload**:
     ```json
   {
      "weight": "in kg",
      "id": "NIK (id) "
    }
     ```
   - **Response**:
     ```json
     {
       "status": "success",
       "message": "Prediction updated successfully"
     }
     ```

### Profile

1. **Update Profile**
   - **URL**: `/nurse/profile/`
   - **Method**: `PUT`
   - **Description**: Memperbarui profil pengguna.
   - **Request Payload**:
     ```json
     {
      "profileImage" : " multipart/form",
      "name" : "nurse name",
      "password" : "password akun nurse"
     }
     ```
   - **Response**:
     ```json
     {
       "status": "success",
       "message": "Profile updated successfully"
     }
     ```

