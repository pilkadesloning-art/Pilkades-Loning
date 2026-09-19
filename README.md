# Aplikasi Rekap Pilkades — 6 TPS / 2 Calon

Aplikasi web sederhana dengan:
- Frontend: HTML/CSS/JavaScript
- Database: Google Sheets
- API: Google Apps Script Web App
- Hosting frontend: GitHub Pages

## 1. Buat Google Sheets

Buat spreadsheet baru, lalu buka **Extensions > Apps Script**.

Hapus kode bawaan dan paste isi `google-apps-script/Code.gs`.

Simpan, lalu jalankan fungsi `setupSheet` sekali. Berikan izin yang diminta Google.

Kembali ke Google Sheets. Akan ada sheet bernama `Rekap`.

Ubah:
- B1 menjadi nama Calon 1
- C1 menjadi nama Calon 2

Contoh:
- B1 = Ahmad
- C1 = Budi

## 2. Deploy Google Apps Script

Di Apps Script:
1. Klik **Deploy > New deployment**
2. Pilih type **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Deploy
6. Salin **Web app URL**

Catatan: untuk aplikasi publik, siapa pun yang mengetahui URL API dapat mengirim data. Jika perlu keamanan/pembatasan operator, tambahkan autentikasi sebelum dipakai untuk pemungutan suara resmi.

## 3. Hubungkan frontend

Buka `app.js`.

Cari:
`const API_URL = "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";`

Ganti dengan Web App URL, contoh:
`const API_URL = "https://script.google.com/macros/s/XXXX/exec";`

## 4. Upload ke GitHub

Buat repository baru, misalnya `pilkades-rekap`.

Upload:
- `index.html`
- `style.css`
- `app.js`
- folder `google-apps-script` (opsional, untuk dokumentasi)

Lalu buka:
**Settings > Pages > Deploy from branch > main > /(root)**

GitHub akan memberikan alamat GitHub Pages.

## 5. Pengujian

Sebelum digunakan:
1. Masukkan angka contoh di TPS 1-6.
2. Klik Simpan Rekap.
3. Periksa Google Sheets.
4. Refresh website.
5. Pastikan angka tetap ada.
6. Uji angka kosong, 0, dan angka besar.
7. Periksa total suara sah, tidak sah, dan total keseluruhan.

## Catatan untuk penggunaan resmi

Versi ini adalah fondasi aplikasi rekap, bukan sistem keamanan pemilu. Untuk penggunaan resmi sebaiknya ditambah:
- login operator per TPS,
- audit log setiap perubahan,
- penguncian data setelah disahkan,
- backup,
- timestamp,
- identitas operator,
- validasi terhadap formulir C hasil,
- role admin/operator,
- HTTPS dan pembatasan akses API,
- mekanisme koreksi yang tercatat,
- ekspor PDF/Excel,
- dan prosedur verifikasi silang dengan berita acara.
