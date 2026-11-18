# LoveVault - Brankas Tanggal Jadian 💖

Aplikasi web interaktif satu halaman (Single Page Application - SPA) romantis, cute, dan estetik (*bucin vibes*) untuk mengunci kenangan terindah, foto polaroid, dan surat rahasia di balik 6-digit PIN tanggal jadian.

Dibuat menggunakan **HTML5, Tailwind CSS, dan JavaScript Murni (Vanilla JS)** tanpa backend atau database.

---

## ✨ Fitur Lengkap (Tahap 1, Tahap 2, & Tahap 3)

### 1. Desain Visual & Suasana Bucin Romantis
- **Palet Warna Pastel Romantis**:
  - Soft Blush Pink (`#FFE5EC`), Rose Pink (`#FFB3C6`), Warm Cream (`#FFF8F0`), Deep Rose Accent (`#FB6F92`), Cotton Candy (`#FF8FAB`), dan Dark Rose Crimson (`#C9184A`).
- **Tipografi Google Fonts Manis**:
  - `Quicksand` & `Nunito` untuk teks utama antarmuka modern yang bersih dan ramah.
  - `Caveat` & `Pacifico` untuk tulisan tangan estetik di bawah foto Polaroid dan aksen surat cinta.
- **Background Animasi Canvas**:
  - Hati (love) melayang perlahan dengan efek sinusoidal sway dan denyut lembut.
  - Kelopak bunga sakura (cherry blossom) yang berguguran pelan dengan rotasi 3D alami.
  - Efek ledakan partikel hati (*heart sparkle burst*) setiap kali pengguna mengeklik layar.
- **Tombol Bouncy Jelly**:
  - Efek membal halus saat tombol ditekan (`@keyframes jellyAnimation`), bayangan lembut (*soft pink glowing shadow*).

---

### 2. Mode Pembuat Brankas (Creator Mode)
- **Pasangan Kasmaran**: Input Nama Kamu & Nama Pasangan dengan pill badge *live preview* di navigation bar (`Kamu ❤️ Dia`).
- **PIN Kunci 6-Digit (DDMMYY)**:
  - 6 kotak digit terpisah dengan navigasi otomatis dan dukungan paste.
  - Petunjuk / Hint Lucu dengan chip saran cepat (misal: "Hari jadian 💕", "Kencan bioskop 🎬", "Momen di pantai 🏖️").
- **Upload & Editor Foto Polaroid Klien**:
  - Drag-and-drop atau file picker untuk gambar (JPG, PNG, WEBP).
  - Menggunakan `FileReader` dan `HTML5 Canvas` untuk center-cropping rasio 1:1 khas film Polaroid 600.
  - Pilihan efek filter visual: *Warm Romantic*, *Vintage Nostalgia*, atau *Asli Segar*.
  - Bingkai polaroid klasik dengan washi tape, kemiringan tilt -2.5°, dan caption tulisan tangan live preview.
- **Surat Rahasia Dari Hati**:
  - Kertas surat cinta (*parchment paper*) dengan garis lembut.
  - Tombol template siap pakai: Romantis Puitis, Lucu & Gemesin, dan Janji Setia.
  - Toolbar emoji cepat (💕, 🥺, 🌹, 💌, ✨, 💍, 🧸).
- **Lagu Latar Suasana Hati (Web Audio API Synthesizer)**:
  - 3 Melodi Sintesis Prosedural (100% bekerja offline tanpa ketergantungan file eksternal):
    1. *Music Box Romantis*: denting kotak musik melodi lullaby cinta.
    2. *Acoustic Sweet*: arpeggio petikan dawai gitar akustik hangat.
    3. *Lo-Fi Bucin*: alunan chord vintage hangat santai.
  - Opsi memasukkan tautan file MP3 kustom.
  - Tombol tes preview dengan animasi visualizer bar.
- **Tombol "Isi Contoh" (1-Click Demo)**: Untuk langsung mencoba semua fitur dalam sekali klik.

---

### 3. Mode Brankas Terkunci (Tahap 2: Lock Screen) 🔒
- **Kotak Perhiasan Romantis & Gembok Cinta**:
  - Kartu brankas berbentuk kotak perhiasan pastel (*pastel jewelry box*) dengan border berlian dan bayangan 3D lembut.
  - Gembok cinta 3D (*heart padlock*) yang membal-membal lucu (*bouncing animation*), dengan shackle logam rose gold.
- **Sapaan Personal untuk Pasangan**:
  - Teks sapaan manis: *"Halo [Nama Pasangan], ada rahasia terkunci dari [Nama Kamu] nih! 💌"*.
  - Tombol *"💡 Lihat Petunjuk dari [Nama Kamu]"* yang membuka popup modal petunjuk.
- **6 Bulatan Indikator PIN**:
  - Bulatan bertransformasi menjadi ikon hati merah muda penuh (`❤️`) yang membesar (*pop scale animation*) setiap digit ditekan.
- **Keypad Cute (Bulat Pastel 0-9)**:
  - Tombol angka 0-9 berbentuk lingkaran pastel estetik dengan ikon hati kecil di bawah angka.
  - Tombol *RESET* (Hapus Semua) dan tombol *⌫* (Hapus Satu Digit).
  - Efek suara **"Pop/Boop"** lucu berbasis Web Audio API (oscillator sintetis murni tanpa file audio luar) dengan nada pentatonik musikal.
- **Logika Salah PIN (Teasing Roast)**:
  - Jika 6 digit PIN salah:
    - Kotak brankas bergetar intens (*shake animation*).
    - Memutar suara komikal sedih *"womp-womp"*.
    - Memunculkan banner pesan meledek/menggemaskan yang berganti secara acak.
    - Reset otomatis bulatan indikator setelah jeda singkat agar pasangan bisa mencoba lagi.

---

### 4. Mode Brankas Terbuka (Tahap 2 & 3: Unlocked Screen) 🔓
- **Klimaks Pembukaan**:
  - Shackle gembok cinta terangkat dan berputar terbuka (*unhook animation*) dengan kilau emas dan pink.
  - Suara harpa perayaan merdu (*harp glissando fanfare*).
  - **Semburan Grand Confetti Romantis**: Hati dan kelopak sakura berterbangan di seluruh layar via Canvas engine.
- **Foto Polaroid Interaktif (Click-to-Wiggle)**:
  - Foto Polaroid muncul perlahan (*fade-in & float up*).
  - **Dapat diklik/ditap** untuk membuat foto bergoyang menggemaskan (*wiggle animation*) dan mengeluarkan letupan hati kecil di sekelilingnya!
  - Menampilkan caption tulisan tangan font `Caveat`.
- **Surat Rahasia dengan Amplop Terbuka & Efek Typewriter**:
  - Tampilan amplop surat cinta pastel yang terbuka.
  - Teks surat diketik otomatis huruf demi huruf (*typewriter effect*) dengan kursor berkedip (`|❤️`) dan suara ketikan tuts halus.
  - Tombol kontrol surat: **"⏩ Lewati"** (menampilkan seluruh teks seketika) dan **"🔄 Ulang"** (mengetik ulang dari awal).

---

### 5. Pemutar Musik Vinyl Mini (Tahap 3) 🎵
- Widget piringan hitam (*vinyl*) warna pink pastel mengambang di pojok kanan atas saat brankas terbuka.
- Piringan hitam berputar halus (`@keyframes spinVinylRecord`) dengan jarum *tonearm* yang mendarat di atas vinyl.
- Otomatis memutar melodi romantis begitu PIN benar dan brankas terbuka.
- Dilengkapi tombol kendali:
  - **Klik Piringan / Tombol Play-Pause**: Memutar atau menjeda musik (vinyl berhenti berputar dan jarum terangkat).
  - **Tombol Mute**: Membisukan atau membunyikan audio (`🔊` / `🔇`).

---

### 6. Fitur Kirim ke Pacar Tanpa Database (Tahap 3) 💌
- **Kompresi Gambar Sisi Klien**:
  - Foto Polaroid dikompresi otomatis menggunakan HTML5 Canvas menjadi thumbnail berukuran ~250px dengan kualitas JPEG 0.5 (~8-12 KB).
  - Seluruh data (Nama, Pasangan, PIN, Petunjuk, Foto Kompresi, Caption, Surat, Lagu) digabungkan menjadi objek JSON lalu di-encode ke Base64 pada URL Hash (`#vault=...`).
- **Salin Link Brankas**:
  - Tombol **"📋 Salin Link Brankas untuk Pasangan"** otomatis menyalin URL lengkap ke clipboard untuk dikirimkan melalui WhatsApp atau chat.
- **Mode Penerima Langsung**:
  - Saat pasangan membuka link dengan `#vault=...`, aplikasi otomatis membaca data terenkripsi dan **langsung masuk ke Mode Brankas Terkunci** milik pasangan tanpa menampilkan form pembuat! Foto dan surat tersimpan aman di dalam link.

---

### 7. Fitur Pamer ke IG Story / Download Card (Tahap 3) 📸
- Tombol **"📸 Simpan Kenangan (IG Story) ✨"** di halaman Brankas Terbuka.
- Menggunakan HTML5 Canvas beresolusi tinggi ukuran vertikal **1080 x 1920 piksel (rasio 9:16)**.
- Kartu Story berisi:
  - Latar belakang gradasi pastel romantis dengan taburan bunga sakura, hati, dan kilau emas.
  - Header badge: *"✨ LOVEVAULT • BUKTI CINTA ABADI ✨"*.
  - Nama pasangan dalam font kaligrafi manis: *"[Nama Kamu] ❤️ [Nama Pasangan]"*.
  - Badge prestasi: *"🎉 Berhasil Buka LoveVault ❤️"*.
  - Bingkai Polaroid 3D realistis dengan foto pasangan dan caption tulisan tangan.
  - Kotak kutipan surat cinta (*quote parchment box*).
  - Tanda PIN tanggal jadian abadi dan watermark estetik.
- Otomatis terunduh sebagai berkas PNG berkualitas tinggi (`LoveVault-[NamaKamu]-[NamaPasangan]-Story.png`) yang siap diunggah ke Instagram Story!

---

## 📁 Struktur Berkas

```
lovevault/
├── index.html              # Struktur utama SPA (Creator, Locked Jewelry Box, Unlocked Sanctuary & Vinyl Player)
├── css/
│   └── styles.css          # Styling pastel, vinyl player, heart padlock, cute keypad, polaroid wiggle, typewriter
├── js/
│   ├── particles.js        # Canvas engine: floating hearts, sakura, click burst & grand confetti cannon
│   ├── audio.js            # Web Audio API: bubbly boop keypad, womp-womp error, typewriter clicks, harp & 3 BGM moods
│   ├── polaroid.js         # FileReader + Canvas image cropping, filter & compressed thumbnail generator (~250px JPEG)
│   ├── storyCard.js        # Generator kartu Instagram Story 9:16 (1080 x 1920 px PNG)
│   └── app.js              # State manager, form validation, vinyl controller, URL hash sharing, IG story download
└── README.md
```

---

## 🚀 Cara Menjalankan

Aplikasi ini dibuat murni di sisi klien (Client-side Only). Cukup buka berkas `index.html` langsung di browser favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) dengan cara:
- **Klik dua kali** pada berkas `index.html`, atau
- Klik kanan `index.html` lalu pilih **Open with > Chrome / Edge**.
