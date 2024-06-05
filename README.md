# 🍼 BabyMeter 👶

![BabyMeter Logo](https://storage.googleapis.com/asset-design/logo/Cuplikan%20layar%202024-06-05%20110602.png)

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
│   ├── errorHandler.js
│   └── validators.js
├── server.js
├── package.json
├── .env
└── README.md
```

## 🚀 Instalasi dan Konfigurasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/babymeter.git
   cd babymeter
   ```

2. **Instal Dependencies**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase**
   - Tambahkan file kredensial Firebase Anda di `config/capstone-babymeter-firebase-adminsdk.json`.

4. **Buat File .env**
   - Buat file `.env` di root proyek dan tambahkan konfigurasi berikut:
     ```env
     PORT=3000
     JWT_SECRET=your_jwt_secret
     ```

5. **Jalankan Server**
   ```bash
   node server.js
   ```

## 🎯 Penggunaan API

### Autentikasi

- **Register**: `POST /auth/register`
  - Body:
    ```json
    {
      "token": "your_firebase_token"
    }
    ```

- **Login**: `POST /auth/login`
  - Body:
    ```json
    {
      "email": "your_email",
      "password": "your_password"
    }
    ```

### Prediksi

- **Buat Prediksi Baru**: `POST /nurse/predictions`
  - Body:
    ```json
    {
      "imageUrl": "url_gambar",
      "name": "nama_bayi",
      "age": "umur_bayi"
    }
    ```

- **Ambil Semua Prediksi**: `GET /nurse/predictions`

- **Edit Prediksi**: `PUT /nurse/predictions/{id}`
  - Body:
    ```json
    {
      "name": "nama_bayi",
      "height": 75,
      "weight": 10,
      ...
    }
    ```

### Profil Perawat

- **Perbarui Profil Perawat**: `PUT /nurse/profile`
  - Body:
    ```json
    {
      "name": "nama_perawat",
      "email": "email_perawat",
      "picture": "url_foto"
    }
    ```

Selamat menggunakan BabyMeter! 🎉👶✨