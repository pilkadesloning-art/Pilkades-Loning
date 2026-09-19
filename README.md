# Rekap Pilkades — 6 TPS, 2 Calon, Operator TPS + Admin

Arsitektur:
Google Sheets (database) ← Google Apps Script Web App (API) ← GitHub Pages (website).

## Alur
- Operator TPS memilih TPS 1-6, login dengan PIN TPS, lalu mengisi Calon 1, Calon 2, dan Tidak Sah.
- Operator hanya bisa membaca/menyimpan TPS miliknya.
- Admin login dengan PIN admin dan dapat melihat rekap masing-masing TPS + total 6 TPS.
- Nama calon dan PIN diatur di sheet `Config`.

## Setup Google Sheets
1. Buat spreadsheet.
2. Extensions > Apps Script.
3. Paste `google-apps-script/Code.gs`.
4. Save.
5. Jalankan `setupSheet()` sekali.
6. Di sheet `Config`, ubah:
   - B2 = nama calon 1
   - B3 = nama calon 2
   - B4 = PIN admin
   - B5-B10 = PIN TPS 1-6
7. Deploy > New deployment > Web app.
   - Execute as: Me
   - Who has access: Anyone
8. Salin URL `/exec`.

## Setup GitHub
1. Abra `app.js`.
2. Ganti `PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` dengan URL Web App.
3. Upload `index.html`, `style.css`, `app.js` ke repository.
4. Settings > Pages > Deploy from branch `main`, root.
5. Buka URL GitHub Pages.

## PIN default demo
Admin: 123456
TPS 1: 1001
TPS 2: 1002
TPS 3: 1003
TPS 4: 1004
TPS 5: 1005
TPS 6: 1006

Segera ganti PIN sebelum dipakai.

## Catatan keamanan
Versi ini menggunakan PIN sederhana dan token sesi Apps Script. Untuk penggunaan resmi, tambahkan akun operator, audit log, penguncian setelah pengesahan, backup, pembatasan akses API, serta prosedur verifikasi dengan dokumen/berita acara.
