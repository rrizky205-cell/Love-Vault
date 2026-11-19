# LoveVault - Brankas Tanggal Jadian 💖

Aplikasi web interaktif satu halaman (Single Page Application - SPA) romantis, cute, dan estetik (*bucin vibes*) untuk mengunci kenangan terindah, foto polaroid, dan surat rahasia di balik 6-digit PIN tanggal jadian.

Dibuat menggunakan **HTML5, Tailwind CSS, dan JavaScript Murni (Vanilla JS)** tanpa backend atau database.

---

## ✨ Fitur Lengkap & Pembaruan Terkini

### 1. Sistem 9 Template Estetik (Mode 1 Foto & Mode 2 Foto) 🎨
Sebelum upload foto, pengguna memilih mode foto dengan pilihan desain eksklusif:
- **Mode 1 Foto (5 Pilihan Template HD)**:
  - `Template 1A`: Bingkai Beige Abstrak & Garis Ilustrasi Bunga Organik.
  - `Template 1B`: Kolase Vintage Teddy Bear, Kupu-Kupu & Kamera Retro.
  - `Template 1C (Baru)`: Coquette Pink Ribbon dengan pita satin, untaian mutiara, dan renda lembut.
  - `Template 1D (Baru)`: Classic 35mm Film Frame dengan sprocket film dan marking Kodak Portra 400.
  - `Template 1E (Baru)`: Romantic Floral Scrapbook bergaya kertas kraft, bunga kering & cap prangko cinta 14¢.
- **Mode 2 Foto (4 Pilihan Template HD)**:
  - `Template 2A`: Latar Rajutan Krem Hangat dengan 2 Polaroid Miring, Boneka Teddy & Bunga Lili.
  - `Template 2B (Baru)`: Sweet Photobooth Strip vertikal 2 foto bertumpuk ala photobox Korea.
  - `Template 2C (Baru)`: Pinned Corkboard Duo dengan papan gabus/linen, pin merah & masking tape transparan.
  - `Template 2D (Baru)`: Minimalist Aesthetic Collage tata letak editorial modern majalah gaya hidup.

---

### 2. Kualitas Foto Polaroid HD (Anti-Burik) 📸
- Menghentikan kompresi resolusi rendah lama.
- Foto pengguna dipertahankan dalam resolusi HD (1080px - 1800px dengan kompresi WebP/JPEG kualitas tinggi 0.88 - 0.92).
- Kanvas Polaroid dirender pada resolusi ultra tinggi (minimal 1200x1500 hingga 1400x1400 px) dengan `ctx.imageSmoothingQuality = 'high'`.
- Perhitungan matematika `object-fit: cover` akurat mencegah foto gepeng, melar, atau terdistorsi pada semua orientasi (portrait, landscape, square).

---

### 3. Share Link Pendek & Bebas Database (Cloud JSON API) 💌
- Tidak lagi menyematkan Base64 raksasa di URL hash yang rawan rusak dan terpotong di WhatsApp.
- Menggunakan ID pendek bersih berformat: `${origin}/?id=${vaultId}`.
- Didukung oleh:
  - Vercel Serverless Function di `/api/save.js` & `/api/load.js` sebagai proxy CORS.
  - Sinkronisasi direct ke Cloud JSON API gratis (`jsonblob.com`).
  - Fallback offline darurat ke URL Hash LZ-String `#v=...`.
- Layar pemuatan manis (*Cute Heart Loading Overlay*) saat data brankas diambil dari Cloud.
- Saat dibuka di HP pasangan atau tab Incognito, aplikasi langsung membuka **Mode Brankas Terkunci** tanpa menampilkan halaman pembuatan.

---

### 4. Fitur Bagikan ke Instagram Story (Web Share API) 📲
- Merender gambar vertikal 1080x1920 px (rasio 9:16) beresolusi tinggi.
- Menggunakan **Web Share API (`navigator.share`)**: pada ponsel Android dan iPhone, tombol langsung memunculkan menu bawaan sistem untuk dibagikan langsung ke Instagram Story atau WhatsApp.
- Fallback otomatis ke pengunduhan file PNG jika dibuka di desktop atau peramban yang tidak mendukung Web Share API.
- Tampilan kartu memuat foto polaroid, nama pasangan, excerpt surat cinta, PIN tanggal jadian abadi, dekorasi kelopak sakura, dan watermark manis "LoveVault ❤️".

---

### 5. Pemutar Musik Vinyl Mini & YouTube IFrame Audio Engine 🎵
- Deteksi otomatis link YouTube berbagai format (`youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`, atau `music.youtube.com`).
- Parsing 11-karakter Video ID via Regex dan pemutaran melalui YouTube IFrame Player API tersembunyi.
- Tombol **"Tes Putar Lagu 🎵"** di form pembuat untuk menguji audio sebelum brankas dikunci.
- Autoplay sinkron saat PIN ke-6 ditekan benar untuk melewati batasan autoplay browser.
- Piringan hitam pastel interaktif dengan tombol play, pause, dan mute.
- Pilihan instrumen bawaan berbasis Web Audio API (Music Box, Acoustic Sweet, Lo-Fi Bucin).

---

### 6. Mode Brankas Terkunci & Buka Brankas Romantis 🔒
- Gembok hati 3D pastel membal (*bouncing heart padlock*).
- Keypad bulat pastel 0-9 dengan efek suara "pop/boop" Web Audio API.
- Deteksi PIN 6 digit dengan pesan ledekan gemas acak jika salah.
- Efek typewriter pengetikan surat rahasia otomatis dengan amplop terbuka.
- Animasi semburan confetti hati & kelopak sakura melayang di kanvas latar belakang.

---

## 📁 Struktur Berkas

```
lovevault/
├── index.html              # Antarmuka SPA lengkap dengan 9 template picker & loading overlay
├── vercel.json             # Konfigurasi routing serverless Vercel
├── api/
│   ├── save.js             # Serverless handler untuk menyimpan JSON data brankas
│   └── load.js             # Serverless handler untuk membaca JSON data brankas berdasarkan ID
├── assets/                 # Template visual SVG & raster HD lokal (Bebas Canvas Tainting)
│   ├── template-1a.png     # Template 1A: Beige & Floral Line
│   ├── template-1b.jpg     # Template 1B: Vintage Teddy & Camera
│   ├── template-1c.svg     # Template 1C: Coquette Pink Ribbon
│   ├── template-1d.svg     # Template 1D: Classic 35mm Film Frame
│   ├── template-1e.svg     # Template 1E: Romantic Floral Scrapbook
│   ├── template-2a.jpg     # Template 2A: Double Cozy Knit
│   ├── template-2b.svg     # Template 2B: Sweet Photobooth Strip
│   ├── template-2c.svg     # Template 2C: Pinned Corkboard Duo
│   └── template-2d.svg     # Template 2D: Minimalist Aesthetic Collage
├── css/
│   └── styles.css          # Styling pastel, animasi bouncy jelly, vinyl player, cute keypad
├── js/
│   ├── particles.js        # Canvas engine kelopak sakura, hati melayang & confetti
│   ├── audio.js            # Synthesizer Web Audio API & YouTube IFrame Player controller
│   ├── polaroid.js         # Engine render kanvas Polaroid HD (1200x1500+) untuk 9 template
│   ├── storyCard.js        # Generator kartu IG Story 1080x1920 HD dengan Web Share API
│   └── app.js              # State manager, Cloud JSON save/load, routing & event handlers
└── README.md
```

---

## 🚀 Cara Menjalankan

Aplikasi ini dibuat murni di sisi klien (Client-side Only). Cukup buka berkas `index.html` langsung di browser favorit Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) dengan cara:
- **Klik dua kali** pada berkas `index.html`, atau
- Klik kanan `index.html` lalu pilih **Open with > Chrome / Edge**.
