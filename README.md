Berikut adalah README yang diperbarui dengan gambar logo dan arsitektur backend.

# BabyMeter API Documentation

![BabyMeter Logo](https://storage.googleapis.com/asset-design/logo/Babymeter%20Logo%20HD.png)

BabyMeter adalah sebuah proyek yang menyediakan API untuk memantau dan memprediksi pertumbuhan bayi. API ini memungkinkan pengguna untuk mendaftar, masuk, membuat prediksi pertumbuhan bayi, dan mengelola profil mereka.

## URL Backend
http://34.128.99.253:3000/

## Architecture
![Architecture-Backend](https://storage.googleapis.com/asset-design/architecture-backend/Diagram%20Tanpa%20Judul.jpg)

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
         "nik": "string",
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
   - **URL**: `/nurse/predictions/`
   - **Method**: `GET`
   - **Description**: Mengambil semua prediksi.
   - **Response**:
     ```json
     [
       {
         "nik": "string",
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

3. **Get Prediction by ID**
   - **URL**: `/nurse/predictions/{id}`
   - **Method**: `GET`
   - **Description**: Mengambil prediksi berdasarkan ID.
   - **Response**:
     ```json
     {
       "nik": "string",
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
     ```

4. **Update Prediction**
   - **URL**: `/nurse/predictions/{id}`
   - **Method**: `PUT`
   - **Description**: Memperbarui prediksi tertentu.
   - **Request Payload**:
     ```json
     {
       "weight": "in kg",
       "nik": "NIK"
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
       "profileImage": "multipart/form-data",
       "name": "nurse name",
       "password": "password akun nurse"
     }
     ```
   - **Response**:
     ```json
     {
       "status": "success",
       "message": "Profile updated successfully"
     }
     ```

## Usage Example

### Register User
```bash
curl -X POST http://34.128.99.253:3000/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}'
```

### Login User
```bash
curl -X POST http://34.128.99.253:3000/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "test@example.com",
  "password": "password123"
}'
```

### Create Prediction
```bash
curl -X POST http://34.128.99.253:3000/nurse/predictions \
-H "Authorization: Bearer {idToken}" \
-H "Content-Type: application/json" \
-d '{
  "userId": "user_id",
  "predictionData": {
    "age": 12,
    "babyName": "John Doe",
    "confidence": 0.95,
    "createdAt": "2024-01-01T00:00:00Z",
    "id": "123456",
    "lingkar_dada": 30.0,
    "lingkar_kepala": 40.0,
    "lingkar_lengan": 15.0,
    "lingkar_paha": 20.0,
    "lingkar_perut": 35.0,
    "panjang_badan": 50.0,
    "prediction": "Normal",
    "suggestion": "Keep up the good work!",
    "updatedAt": "2024-01-01T00:00:00Z",
    "weight": 7.5
  }
}'
```

### Get Predictions
```bash
curl -X GET http://34.128.99.253:3000/nurse/predictions \
-H "Authorization: Bearer {idToken}"
```

### Update Profile
```bash
curl -X PUT http://34.128.99.253:3000/nurse/profile/ \
-H "Authorization: Bearer {idToken}" \
-H "Content-Type: multipart/form-data" \
-F "profileImage=@path/to/image.jpg" \
-F "name=New Name" \
-F "password=newpassword123"
```