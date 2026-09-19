# Rekap Pilkades — Versi Password

Versi ini mengganti login dari PIN menjadi Password.

## Password awal

| Akses | Password awal |
|---|---|
| Admin | AdminLoning2026 |
| TPS 1 | TPS1Loning2026 |
| TPS 2 | TPS2Loning2026 |
| TPS 3 | TPS3Loning2026 |
| TPS 4 | TPS4Loning2026 |
| TPS 5 | TPS5Loning2026 |
| TPS 6 | TPS6Loning2026 |

Segera ganti password tersebut di sheet `Config` setelah instalasi.

## Config

Gunakan pasangan kunci berikut:

- `admin_password`
- `tps1_password`
- `tps2_password`
- `tps3_password`
- `tps4_password`
- `tps5_password`
- `tps6_password`

Jangan menghapus baris `candidate1` dan `candidate2`.

## Deploy Apps Script

1. Salin `google-apps-script/Code.gs` ke Apps Script.
2. Pastikan `SPREADSHEET_ID` menunjuk ke Google Sheet yang benar.
3. Jalankan `setupSheet()` sekali jika `Rekap`/`Config` belum ada.
4. Simpan.
5. Deploy > Manage deployments.
6. Edit deployment Web App dan pilih versi baru.
7. Execute as: Me.
8. Who has access: Anyone.
9. Pertahankan URL `/exec` yang sama.

Deployment versi baru diperlukan agar Web App publik menggunakan kode terbaru. Google menjelaskan bahwa versioned deployment terhubung ke versi kode tertentu; saat kode berubah, deployment perlu diarahkan ke versi baru. 
