# 🌙 Muslim Tracker Web App

Website **Muslim Tracker & Mutaba'ah Yaumiyah** modern, responsif, dan lengkap untuk mendampingi ibadah harian seorang muslim. Dirancang dengan tampilan elegan bertema islami (Emerald & Gold Dark Mode), interaksi yang halus, kalkulasi astronomis akurat, serta penyimpanan data offline di browser tanpa membutuhkan database luar.

---

## 🌟 Fitur Unggulan

### 1. 🕌 Jadwal Sholat Akurat & Hitung Mundur (Countdown)
- **Algoritma Astronomis Mandiri (Offline)**: Menggunakan standar Kementerian Agama Republik Indonesia (Kemenag RI: Subuh 20°, Isya 18°, Ihtiyat 2 menit).
- **Pilihan 20+ Kota Indonesia**: Jakarta, Surabaya, Bandung, Medan, Semarang, Makassar, Yogyakarta, Denpasar, Padang, Banda Aceh, dll.
- **Hitung Mundur Real-Time**: Tampilan waktu sholat berikutnya lengkap dengan detik hitung mundur secara live.
- **Kalender Hijriah Terpadu**: Tanggal Masehi dan konversi kalender Hijriah otomatis.

### 2. ✅ Mutaba'ah Sholat 5 Waktu & Sunnah
- **Sholat Wajib**: Catat pelaksanaan Subuh, Dzuhur, Ashar, Maghrib, Isya dengan opsi status:
  - 🕌 **Berjamaah di Masjid** (+8 poin)
  - ⏱️ **Tepat Waktu di Rumah** (+7 poin)
  - ⏳ **Terlambat / Lewat Waktu** (+4 poin)
- **Sholat Sunnah**:
  - Qiyamul Lail / Tahajjud
  - Sholat Dhuha
  - Sholat Witir
  - Sholat Sunnah Rawatib (Qobliyah & Ba'diyah)

### 3. 📖 Tracker Tilawah & Target Khatam Al-Qur'an
- **Progress Khatam Mushaf**: Melacak halaman 1 hingga 604 (30 Juz) dengan persentase dan estimasi sisa hari khatam.
- **114 Surah Database**: Dropdown lengkap 114 Surah Al-Qur'an (Makkiyyah & Madaniyyah beserta jumlah ayat).
- **Log Tilawah Harian**: Catat surah, rentang ayat, jumlah lembar/halaman yang dibaca, serta catatan tadabbur.

### 4. 📿 Digital Tasbih & Dzikir Pagi-Petang
- **Sintesis Audio & Getaran (Haptic)**: Suara klik tasbih alami menggunakan Web Audio API tanpa butuh file MP3 eksternal, lengkap dengan efek getaran ponsel (*vibration*).
- **Preset Dzikir Populer**: Subhanallah (33x), Alhamdulillah (33x), Allahu Akbar (33x), Astaghfirullah (100x), Sholawat Nabi (100x), dan Bebas.
- **Dzikir Pagi & Petang Lengkap**: Teks Arab berharakat, transliterasi Latin, terjemahan bahasa Indonesia, jumlah bacaan, dan fadhilah shahih (Ayat Kursi, Sayyidul Istighfar, Mu'awwidzatain, dll.).

### 5. 🌙 Shaum (Puasa) & Kalkulator Qadha
- **Checklist Puasa Hari Ini**: Pilihan puasa Senin-Kamis, Ayyamul Bidh (13-15 Hijriyah), Ramadhan, Qadha, Daud, dll.
- **Rekomendasi Otomatis**: Mendeteksi hari Senin/Kamis dan tanggal pertengahan bulan Hijriyah secara dinamis.
- **Pelunasan Hutang Qadha**: Catat total hari hutang puasa, cicil pelunasan, dan lihat progres persentase sisa kewajiban.

### 6. 🤲 Sedekah & Infaq Yaumiyah
- **Catat Sedekah Subuh & Infaq Harian**: Input nominal, kategori (Masjid, Dhuafa, Bencana, Wakaf), serta niat sedekah.
- **Rekap Akumulasi**: Hitung otomatis total sedekah bulan berjalan dan total keseluruhan.

### 7. 📊 Skor Ketaatan & Grafik Streak Mingguan
- **Skor Harian Dinamis (0 - 100%)**: Evaluasi mutaba'ah harian dengan predikat (*Mumtaz*, *Jayyid Jiddan*, *Jayyid*, atau *Semangat Berbenah*).
- **Streak Tracker**: Mengukur berapa hari berturut-turut Anda aktif mengisi mutaba'ah.
- **Grafik Batang 7 Hari**: Pantau konsistensi ibadah sepekan terakhir.

### 8. 💾 Keamanan Data & Portabilitas
- **100% Offline & Privat**: Disimpan langsung di browser pengguna (`LocalStorage`).
- **Ekspor & Impor Cadangan**: Unduh backup format `.json` dan pulihkan kapan saja.
- **Mode Cetak (Print Friendly)**: Desain khusus untuk mencetak kartu laporan mutaba'ah ke PDF atau kertas.

---

## 🚀 Cara Menjalankan Website

Aplikasi ini dirancang bebas dependensi rumit dan dapat langsung dijalankan:

### Cara 1: Menggunakan Local Server (Direkomendasikan)
1. Buka terminal di folder project:
   ```bash
   cd "C:\Users\User\.gemini\antigravity\scratch\muslim-tracker"
   ```
2. Jalankan server bawaan Node.js:
   ```bash
   npm start
   ```
3. Buka browser dan akses:
   👉 **`http://localhost:3000`**

### Cara 2: Buka Langsung File HTML
Cukup klik ganda (double-click) file **`index.html`** di Windows Explorer untuk membukanya di browser (Google Chrome, Microsoft Edge, Firefox, dll.).

---

## 📂 Struktur Berkas

```
muslim-tracker/
├── index.html            # Halaman utama aplikasi (UI, tab, dan modal)
├── package.json          # Konfigurasi project & script start
├── server.js             # HTTP server native Node.js (tanpa dependensi luar)
├── css/
│   └── styles.css        # Tema Islamic Dark, Glassmorphism, animasi & print styles
├── js/
│   ├── app.js            # Orkestrasi navigasi, jam live, countdown & event listeners
│   ├── storage.js        # Manajemen LocalStorage, kalkulasi skor, streak, dan cadangan
│   ├── prayer-times.js   # Kalkulasi waktu sholat astronomis & kalender Hijriah
│   ├── tracker.js        # Logika mutaba'ah sholat 5 waktu, sunnah, dan habits
│   ├── quran.js          # Progress 30 Juz / 604 halaman & metadata 114 surah
│   ├── tasbih.js         # Tasbih interaktif, Web Audio synth & Dzikir Pagi-Petang
│   ├── fasting.js        # Logika puasa sunnah & manajemen hutang qadha
│   └── charity.js        # Pencatatan sedekah & formatter rupiah
└── README.md             # Dokumentasi lengkap
```

---

*Semoga aplikasi ini bermanfaat dan memudahkan kita dalam menjaga keistiqomahan beribadah kepada Allah Subhanahu wa Ta'ala.* 🤲

