// config.js
const dotenv = require("dotenv");
dotenv.config();

const config = {
  port:"3000",
  host:"0.0.0.0",
  firebaseConfig: {
    apiKey:"AIzaSyAHzqGqq2q3VDVY1I2U5AsbHMxbsCmjcF4",
    authDomain:"capstone-babymeter.firebaseapp.com",
    projectId:"capstone-babymeter",
    storageBucket:"capstone-babymeter.appspot.com",
    messagingSenderId:"666638203383",
    appId:"1:666638203383:web:ff12cf46740f7b0d0416f2",
    measurementId:"G-37MPS640PN",
  },
  firebaseAdminConfig: {
    type:"service_account",
    project_id:"capstone-babymeter",
    private_key_id:"1bf92a891ca7ad8cb09efb0f952ffed813ea509c",
    private_key:"-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDENIJJk/eMvOxi\na96VGlUJ4/qPPfPaN5TPUl8lChBuoQrlB+9RMVVpG/up28siAdGuCfmg2UFNgrjk\nLYRZN4CEkBk3diWpsTQv0NxMvr+dOgg158ldfWgVlcE9aFL0ZFpcLa5E1QZwA0Fd\nJvyCIhCGyksFjTvB6RRKsWjrHVFhBUfc2sggqG4lXP/l+tJ6bM0aDyyM+oqiEJYj\nega8KGO8r+6XsEeyKW7FH7RXW6huoZcBCuxQM25YQ5Dh/fHoC7tw+CcBDvjI2zF0\nYEtpQXesA8jPz/tWbfmr2Cfax2z4nM4M5NaA1QqvnJxPoW2Y3I2BTOQW9JZLCJ/Q\n1YICD3oxAgMBAAECggEAHUblOWZyFhbrbO+XVIdhMMB11wxRsqUAOFlxvLyo4WEi\nwjSHZ4WlhDF6lt4nDFQvfg6bUv7oHtFGloxw3GvgP6ei46LmZtD8LmBg5wtq2zgE\nGUsUweBgeMwSUX/w1OqT4ypRKpCLoojnJtJrnl1ykDJntGnehLEAvU6GDy3zl+F8\nyYcOZ1XnmQsOc/IRLGBjwvDKkRzxwxlXdHf3GjiXud5yhhvzMVslFe0u3jRjdGkV\nVZ6kwie78T7yQc3fImBYoT+y+ml2qR+zGgLyccsR5CzgQSmKkWV609tvAdut1/uH\nioZyxeYNOI1qdOI+DiFBGEN3Wzs57HVxGqjIdmmpswKBgQDiTLLLI/zCESjc1Rrs\nB24Sis2sPwr4cSZhtoNSzE14yJARfRHVkAu00uWQ68CVlitbVodblaDO6T5enB/V\n6nhzCbuYmVYtKy19hr4baSI4IuOEC2c800fGpH0YvOs9cJmoi78jEQRI8vT/kUlA\nJgPqSvoABaNNcW1DdVnrysX/1wKBgQDd9K8oAlj39R8x0TV9oRNYQaz5pZRuUBcb\nh+ctanff1DRXleETBA8mqpVtQRX3hnZaamigfSnZ4rIM4BRVow5ril89nL4lmvAW\nxo1/zW+/7syVXCAUslRifVIKNZcMYygnKlUNvN70jN4Nw5VliL/MIMuJyqo/LT68\nlL72LyI1NwKBgQCmfzvEzhN3TVy9LWWDZuwLZGhyZGfT5pwQpFH2py4Qwa+NznFC\nqZqTTd9tQqcM59G6f+1S6sHHukATJ9ccckhwiyak3ZxT20K66loQnMd6eeDfE+y/\nCcvzUK5hdw20xJWpNjhIuopmiarMJb65Hb8fsE5DmeJOZje3vC2OmEAZPQKBgQCX\noIdj+q6SvebQno4/Q6G2gi9L4JzU+2u9yAra0MgRpaMYTnCTEAvVq2UnXPZHwZjq\nzZSqRrcnfSGLgC0ED79TIhVMPt77S6xGst+JdmuoH9etFWFpIiZZnilEhjWpJbgR\ngW7XUraxM+aiWoGd+lykc6b4e/Xv8NXR+H+4KJzi4wKBgQDQ3ByqDBz97gZE3+rS\nYm7hHRm+P8MqJFeGzjQDof99HLeUmfoRqIULlBQcynfSs+A9NlDgKF9SQL7qheGs\n/HpvLT6LkoUkgxtg6SiwnaENbplTE60ydxNRfdFBgwy/eZAjOHSvgfKIsjO9nK1b\nIUHuatG9akje92ns2/6DMTET0w==\n-----END PRIVATE KEY-----",
    client_email:"firebase-adminsdk-f1kgg@capstone-babymeter.iam.gserviceaccount.com",
    client_id:"109613014004792337973",
    auth_uri:"https://accounts.google.com/o/oauth2/auth",
    token_uri:"https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url:"https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-f1kgg@capstone-babymeter.iam.gserviceaccount.com"
  },
};

module.exports = config;

