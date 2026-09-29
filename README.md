# Backend API - Modul Login & Management Access

Proyek ini adalah studi kasus Modul Login dan Management Access yang dikembangkan menggunakan Node.js, Express, dan PostgreSQL. Sistem ini mengimplementasikan autentikasi JWT, deteksi jabatan ganda (*multiple roles*), dan struktur menu hierarkis (*recursive/nested tree*).

## Spesifikasi
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **Autentikasi:** JSON Web Token (JWT) & bcryptjs

## Dokumentasi API (Endpoint)

### 1. Proses Login (Tahap 1)
Endpoint ini digunakan untuk memvalidasi kredensial pengguna. Jika pengguna memiliki lebih dari satu jabatan (Role), sistem akan meminta pengguna untuk memilih Role terlebih dahulu.

* **URL:** `/api/auth/login`
* **Method:** `POST`
* **Request Body:**
  ```json
  {
    "username": "fathan",
    "password": "password123"
  }