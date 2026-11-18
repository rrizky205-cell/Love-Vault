/**
 * LoveVault - Main Application Logic (Complete with Tahap 1, 2, & 3 Multi-Template Engine)
 * Features:
 * - Mode 1 Foto (Template 1A: Frame Abstrak & Bunga | Template 1B: Vintage Teddy & Retro Cam)
 * - Mode 2 Foto (Template 2A: Double Polaroid Cozy Knit dengan pita kotak-kotak)
 * - Pemutar Musik Vinyl Mini (Piringan hitam pastel berputar di pojok kanan atas)
 * - Sistem Share Link Tanpa Database (Kompresi foto Polaroid ~250px JPEG 0.5 ke URL Hash Base64)
 * - Download Kartu Instagram Story (1080 x 1920 px PNG siap upload ke Story)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Sub-Engines
  const atmosphere = new RomanticAtmosphere('bgCanvas');
  const audio = new RomanticAudioEngine();
  const storyGenerator = new StoryCardGenerator();
  const polaroid = new PolaroidProcessor({
    canvasId: 'polaroidCanvas',
    captionInputId: 'polaroidCaptionInput'
  });

  // Global App State
  const state = {
    userName: '',
    partnerName: '',
    pin: '',
    hint: '',
    caption: 'Hari terindah bersama kamu ❤️',
    secretLetter: '',
    musicMood: 'music_box',
    customMusicUrl: '',
    mode: '1',
    template: '1a',
    enteredPin: '',
    isLockedMode: false
  };

  // Teasing messages for wrong PIN
  const teasingRoasts = [
    "Yah salah! Masa lupa tanggal jadian sendiri sih?! 😤💔",
    "Coba inget-inget lagi ih! Jangan pura-pura lupa ya! 😠",
    "Salah terus, kurangi jatah jajan nih! 😤🧁",
    "Duh, padahal tanggal paling bersejarah lho! Coba klik tombol petunjuk deh 🥺💕",
    "Hati-hati, salah 3 kali didenda peluk 10 menit! 😜💖",
    "Ngaku deh, kamu lupa kan?! Denda traktir seblak sebulan ya! 🥺💔",
    "Masa tanggal manis kita hilang dari ingatanmu? Coba buka petunjuk! 💡🥺",
    "Awas ya kalau nebak-nebak terus, ngambek 3 hari beneran nih! 😤"
  ];

  // DOM Elements - Sections
  const creatorSection = document.getElementById('creatorSection');
  const lockedVaultSection = document.getElementById('lockedVaultSection');
  const unlockedViewSection = document.getElementById('unlockedViewSection');

  // DOM Elements - Form Inputs
  const inputUserName = document.getElementById('inputUserName');
  const inputPartnerName = document.getElementById('inputPartnerName');
  const inputHint = document.getElementById('inputHint');
  const inputSecretLetter = document.getElementById('inputSecretLetter');
  const selectMusicMood = document.getElementById('selectMusicMood');
  const inputCustomMusic = document.getElementById('inputCustomMusic');
  const customMusicContainer = document.getElementById('customMusicContainer');

  // DOM Elements - Mode & Template Pickers
  const btnMode1Photo = document.getElementById('btnMode1Photo');
  const btnMode2Photo = document.getElementById('btnMode2Photo');
  const mode1TemplateSection = document.getElementById('mode1TemplateSection');
  const mode2TemplateSection = document.getElementById('mode2TemplateSection');
  const cardTemplate1A = document.getElementById('cardTemplate1A');
  const cardTemplate1B = document.getElementById('cardTemplate1B');
  const uploadSlotMode1 = document.getElementById('uploadSlotMode1');
  const uploadSlotMode2 = document.getElementById('uploadSlotMode2');

  const photoUploadInputSingle = document.getElementById('photoUploadInputSingle');
  const photoUploadInputSlot1 = document.getElementById('photoUploadInputSlot1');
  const photoUploadInputSlot2 = document.getElementById('photoUploadInputSlot2');
  const dropZonePhotoSingle = document.getElementById('dropZonePhotoSingle');
  const dropZonePhotoSlot1 = document.getElementById('dropZonePhotoSlot1');
  const dropZonePhotoSlot2 = document.getElementById('dropZonePhotoSlot2');

  // DOM Elements - Live Badge & Displays
  const liveCoupleBadge = document.getElementById('liveCoupleBadge');
  const letterCharCount = document.getElementById('letterCharCount');
  const btnLockAndPreview = document.getElementById('btnLockAndPreview');
  const btnReturnToEdit = document.getElementById('btnReturnToEdit');
  const btnFillSample = document.getElementById('btnFillSample');

  // Music Preview Toggle on Form
  const btnToggleMusicPreview = document.getElementById('btnToggleMusicPreview');
  const musicPreviewText = document.getElementById('musicPreviewText');

  // Locked Vault Screen Elements
  const heartPadlockEl = document.getElementById('heartPadlockEl');
  const vaultPartnerGreeting = document.getElementById('vaultPartnerGreeting');
  const vaultUserGreeting = document.getElementById('vaultUserGreeting');
  const vaultHintAuthor = document.getElementById('vaultHintAuthor');
  const teasingAlertContainer = document.getElementById('teasingAlertContainer');
  const teasingAlertText = document.getElementById('teasingAlertText');
  const btnVaultHint = document.getElementById('btnVaultHint');
  const hintModal = document.getElementById('hintModal');
  const hintModalText = document.getElementById('hintModalText');
  const btnCloseHint = document.getElementById('btnCloseHint');

  // Unlocked View Elements
  const unlockedPolaroidCard = document.getElementById('unlockedPolaroidCard');
  const btnWigglePolaroidHint = document.getElementById('btnWigglePolaroidHint');
  const btnSkipTypewriter = document.getElementById('btnSkipTypewriter');
  const btnReplayTypewriter = document.getElementById('btnReplayTypewriter');
  const btnRelockVault = document.getElementById('btnRelockVault');
  const btnEditFromUnlocked = document.getElementById('btnEditFromUnlocked');
  const btnShareVault = document.getElementById('btnShareVault');
  const btnShareVaultFloating = document.getElementById('btnShareVaultFloating');
  const btnDownloadStory = document.getElementById('btnDownloadStory');

  // Mini Pastel Vinyl Player Elements
  const miniVinylWidget = document.getElementById('miniVinylWidget');
  const vinylDiscRecord = document.getElementById('vinylDiscRecord');
  const vinylTonearm = document.getElementById('vinylTonearm');
  const vinylMoodTitle = document.getElementById('vinylMoodTitle');
  const btnToggleVinylDisc = document.getElementById('btnToggleVinylDisc');
  const btnVinylPlayPause = document.getElementById('btnVinylPlayPause');
  const btnVinylMute = document.getElementById('btnVinylMute');

  // Typewriter Engine State
  let typewriterTimer = null;
  let typewriterIndex = 0;

  function getMoodTitle(mood) {
    if (mood === 'acoustic') return 'Acoustic Sweet';
    if (mood === 'lofi') return 'Lo-Fi Bucin';
    if (mood === 'custom') return 'Lagu Kustom';
    return 'Music Box Romantis';
  }

  /* ============================================================
     1. Mode & Template Selection Controller (1 Foto vs 2 Foto)
     ============================================================ */
  function updateModeUI(mode) {
    state.mode = mode;
    polaroid.setMode(mode);

    if (mode === '1') {
      if (btnMode1Photo) {
        btnMode1Photo.className = "btn-jelly px-4 py-3 rounded-2xl border-2 border-[#FB6F92] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm flex flex-col items-center justify-center shadow-md transition-all";
      }
      if (btnMode2Photo) {
        btnMode2Photo.className = "btn-jelly px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white/90 text-pink-700 font-extrabold text-sm flex flex-col items-center justify-center hover:bg-pink-50 shadow-sm transition-all";
      }
      if (mode1TemplateSection) mode1TemplateSection.classList.remove('hidden');
      if (mode2TemplateSection) mode2TemplateSection.classList.add('hidden');
      if (uploadSlotMode1) uploadSlotMode1.classList.remove('hidden');
      if (uploadSlotMode2) uploadSlotMode2.classList.add('hidden');

      updateTemplateUI(polaroid.selectedTemplate === '1b' ? '1b' : '1a');
    } else {
      if (btnMode2Photo) {
        btnMode2Photo.className = "btn-jelly px-4 py-3 rounded-2xl border-2 border-[#FB6F92] bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-sm flex flex-col items-center justify-center shadow-md transition-all";
      }
      if (btnMode1Photo) {
        btnMode1Photo.className = "btn-jelly px-4 py-3 rounded-2xl border-2 border-pink-200 bg-white/90 text-pink-700 font-extrabold text-sm flex flex-col items-center justify-center hover:bg-pink-50 shadow-sm transition-all";
      }
      if (mode1TemplateSection) mode1TemplateSection.classList.add('hidden');
      if (mode2TemplateSection) mode2TemplateSection.classList.remove('hidden');
      if (uploadSlotMode1) uploadSlotMode1.classList.add('hidden');
      if (uploadSlotMode2) uploadSlotMode2.classList.remove('hidden');

      state.template = '2a';
      polaroid.setTemplate('2a');
    }
  }

  function updateTemplateUI(tmplId) {
    state.template = tmplId;
    polaroid.setTemplate(tmplId);

    if (tmplId === '1a') {
      if (cardTemplate1A) {
        cardTemplate1A.className = "cursor-pointer border-2 border-rose-500 bg-pink-50/80 rounded-2xl p-2.5 text-center transition-all shadow-md group relative overflow-hidden";
      }
      if (cardTemplate1B) {
        cardTemplate1B.className = "cursor-pointer border-2 border-pink-200 bg-white/90 rounded-2xl p-2.5 text-center transition-all hover:bg-pink-50 shadow-sm group relative overflow-hidden";
      }
    } else if (tmplId === '1b') {
      if (cardTemplate1B) {
        cardTemplate1B.className = "cursor-pointer border-2 border-rose-500 bg-pink-50/80 rounded-2xl p-2.5 text-center transition-all shadow-md group relative overflow-hidden";
      }
      if (cardTemplate1A) {
        cardTemplate1A.className = "cursor-pointer border-2 border-pink-200 bg-white/90 rounded-2xl p-2.5 text-center transition-all hover:bg-pink-50 shadow-sm group relative overflow-hidden";
      }
    }
  }

  if (btnMode1Photo) {
    btnMode1Photo.addEventListener('click', () => {
      audio.playPop();
      updateModeUI('1');
    });
  }

  if (btnMode2Photo) {
    btnMode2Photo.addEventListener('click', () => {
      audio.playPop();
      updateModeUI('2');
    });
  }

  if (cardTemplate1A) {
    cardTemplate1A.addEventListener('click', () => {
      audio.playPop();
      updateTemplateUI('1a');
    });
  }

  if (cardTemplate1B) {
    cardTemplate1B.addEventListener('click', () => {
      audio.playPop();
      updateTemplateUI('1b');
    });
  }

  // File Upload Handlers & Drag-and-Drop
  function bindDropZone(zone, input, slot) {
    if (!zone || !input) return;
    input.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        polaroid.loadPhotoFile(e.target.files[0], slot, () => {
          showToast(`📸 Foto ${slot} berhasil dimuat!`);
        });
      }
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('border-pink-500', 'bg-pink-100/70');
    });
    zone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      zone.classList.remove('border-pink-500', 'bg-pink-100/70');
    });
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('border-pink-500', 'bg-pink-100/70');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        polaroid.loadPhotoFile(e.dataTransfer.files[0], slot, () => {
          showToast(`📸 Foto ${slot} berhasil dimuat!`);
        });
      }
    });
  }

  bindDropZone(dropZonePhotoSingle, photoUploadInputSingle, 1);
  bindDropZone(dropZonePhotoSlot1, photoUploadInputSlot1, 1);
  bindDropZone(dropZonePhotoSlot2, photoUploadInputSlot2, 2);

  /* ============================================================
     2. PIN Input Handling in Creator Mode (6 Digit Boxes)
     ============================================================ */
  const pinDigits = [
    document.getElementById('pinDigit1'),
    document.getElementById('pinDigit2'),
    document.getElementById('pinDigit3'),
    document.getElementById('pinDigit4'),
    document.getElementById('pinDigit5'),
    document.getElementById('pinDigit6')
  ];

  pinDigits.forEach((input, idx) => {
    if (!input) return;

    input.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val ? val[0] : '';

      if (e.target.value && idx < pinDigits.length - 1) {
        pinDigits[idx + 1].focus();
      }
      updateCreatorPinState();
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        pinDigits[idx - 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text');
      const cleanDigits = paste.replace(/[^0-9]/g, '').slice(0, 6);
      cleanDigits.split('').forEach((d, i) => {
        if (pinDigits[i]) pinDigits[i].value = d;
      });
      if (pinDigits[Math.min(cleanDigits.length, 5)]) {
        pinDigits[Math.min(cleanDigits.length, 5)].focus();
      }
      updateCreatorPinState();
    });
  });

  function updateCreatorPinState() {
    state.pin = pinDigits.map(d => d.value).join('');
  }

  /* ============================================================
     3. Live Couple Badge & Input Listeners
     ============================================================ */
  function updateCoupleDisplay() {
    const u = inputUserName.value.trim() || 'Kamu';
    const p = inputPartnerName.value.trim() || 'Dia';
    state.userName = inputUserName.value.trim();
    state.partnerName = inputPartnerName.value.trim();

    if (liveCoupleBadge) {
      liveCoupleBadge.innerHTML = `<span class="text-pink-600 font-bold">${u}</span> <span class="animate-heartbeat inline-block text-rose-500">❤️</span> <span class="text-pink-600 font-bold">${p}</span>`;
    }
  }

  inputUserName.addEventListener('input', updateCoupleDisplay);
  inputPartnerName.addEventListener('input', updateCoupleDisplay);

  inputHint.addEventListener('input', (e) => {
    state.hint = e.target.value;
  });

  inputSecretLetter.addEventListener('input', (e) => {
    state.secretLetter = e.target.value;
    if (letterCharCount) {
      letterCharCount.textContent = `${e.target.value.length} karakter`;
    }
  });

  // Music Mood Selector
  selectMusicMood.addEventListener('change', (e) => {
    state.musicMood = e.target.value;
    if (state.musicMood === 'custom') {
      customMusicContainer.classList.remove('hidden');
    } else {
      customMusicContainer.classList.add('hidden');
    }

    if (audio.isPlaying) {
      audio.startMusic(state.musicMood, inputCustomMusic.value.trim());
      updateVinylUI(true);
    }
  });

  inputCustomMusic.addEventListener('input', (e) => {
    state.customMusicUrl = e.target.value.trim();
  });

  // Music Preview Toggle Button
  btnToggleMusicPreview.addEventListener('click', () => {
    audio.playPop();
    const isPlaying = audio.togglePlayPause(state.musicMood, inputCustomMusic.value.trim());
    if (isPlaying) {
      musicPreviewText.textContent = 'Jeda Musik Preview';
      btnToggleMusicPreview.classList.add('bg-rose-500', 'text-white');
      btnToggleMusicPreview.classList.remove('bg-pink-100', 'text-pink-700');
    } else {
      musicPreviewText.textContent = 'Dengarkan Preview';
      btnToggleMusicPreview.classList.remove('bg-rose-500', 'text-white');
      btnToggleMusicPreview.classList.add('bg-pink-100', 'text-pink-700');
    }
  });

  // Preset Hint Chips
  document.querySelectorAll('.hint-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      audio.playPop();
      inputHint.value = chip.dataset.hint;
      state.hint = chip.dataset.hint;
      inputHint.focus();
    });
  });

  // Quick Emoji Insertion into Secret Letter
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playPop();
      const emoji = btn.textContent.trim();
      const start = inputSecretLetter.selectionStart;
      const end = inputSecretLetter.selectionEnd;
      const text = inputSecretLetter.value;
      inputSecretLetter.value = text.substring(0, start) + emoji + text.substring(end);
      inputSecretLetter.selectionStart = inputSecretLetter.selectionEnd = start + emoji.length;
      inputSecretLetter.focus();
      state.secretLetter = inputSecretLetter.value;
      if (letterCharCount) {
        letterCharCount.textContent = `${inputSecretLetter.value.length} karakter`;
      }
    });
  });

  // Quick Love Letter Templates
  document.querySelectorAll('.letter-template-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playPop();
      const type = btn.dataset.template;
      let templateText = '';

      const u = state.userName || 'Sayangku';
      const p = state.partnerName || 'Cintaku';

      if (type === 'romantic') {
        templateText = `Untuk ${p} tersayang,\n\nSejak hari pertama kita bersama, duniaku jadi jauh lebih berwarna dan penuh tawa. Terima kasih telah memilihku, mendengarkan cerita-ceritaku yang kadang nggak jelas, dan selalu jadi tempat ternyaman untuk pulang.\n\nBrankas ini mungkin terkunci dengan angka tanggal jadian kita, tapi hatiku sudah kamu kunci selamanya tanpa ada tombol darurat. Aku mencintaimu hari ini, esok, dan seterusnya! 💖✨\n\nSelalu milikmu,\n${u}`;
      } else if (type === 'funny') {
        templateText = `Hai ${p} tukang ngambek tapi gemesin,\n\nSelamat! Kamu berhasil membuka brankas rahasia ini (untung inget tanggal jadian, kalau lupa bakal didenda traktir seblak sebulan! 😜).\n\nTerima kasih sudah sabar menghadapi aku yang banyak maunya ini. Jangan pernah bosen ya, karena cintaku ke kamu itu unlimited kayak kuota sultan!\n\nPeluk hangat dari ${u} 🧸💕`;
      } else if (type === 'promises') {
        templateText = `Kekasih hatiku, ${p},\n\nDi tanggal jadian yang jadi kode brankas ini, aku berjanji:\n1. Selalu ada saat kamu butuh sandaran.\n2. Nggak akan marah kalau kamu lama milih makanan.\n3. Terus mencintaimu bahkan saat kita sudah menua bersama.\n\nKamu adalah hadiah terindah dalam hidupku.\n\nDengan segenap cinta,\n${u} 🌹`;
      }

      inputSecretLetter.value = templateText;
      state.secretLetter = templateText;
      if (letterCharCount) {
        letterCharCount.textContent = `${templateText.length} karakter`;
      }
    });
  });

  // Filter Buttons on Polaroid
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      audio.playPop();
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-rose-500', 'text-white');
        b.classList.add('bg-pink-100', 'text-pink-700');
      });
      btn.classList.add('bg-rose-500', 'text-white');
      btn.classList.remove('bg-pink-100', 'text-pink-700');
      polaroid.setFilter(btn.dataset.filter);
    });
  });

  /* ============================================================
     4. Fill Sample Data (Instant Bucin Setup)
     ============================================================ */
  btnFillSample.addEventListener('click', () => {
    audio.playPop();
    inputUserName.value = 'Rizky';
    inputPartnerName.value = 'Aura';
    updateCoupleDisplay();

    // Fill PIN 140225 (14 Feb 2025)
    const samplePin = '140225';
    samplePin.split('').forEach((d, i) => {
      if (pinDigits[i]) pinDigits[i].value = d;
    });
    updateCreatorPinState();

    inputHint.value = 'Hari pertama kita jadian pas Hari Valentine di bawah pohon sakura! 🌸💕';
    state.hint = inputHint.value;

    const captionInput = document.getElementById('polaroidCaptionInput');
    if (captionInput) {
      captionInput.value = 'Senja pertama saat kita resmi jadian 🌅❤️';
      polaroid.captionText = captionInput.value;
      polaroid.updatePolaroidDOMCaption();
    }

    const sampleLetter = `Untuk Aura tersayang,\n\nSejak tanggal 14 Februari 2025 itu, hidupku jadi seribu kali lebih indah. Terima kasih sudah selalu menjadi alasan di balik senyumku setiap hari.\n\nBrankas ini aku buat khusus untuk menyimpan kenangan manis kita. Semoga cinta kita selalu hangat dan abadi selamanya! 💕\n\nDari Pangeranmu,\nRizky`;
    inputSecretLetter.value = sampleLetter;
    state.secretLetter = sampleLetter;
    if (letterCharCount) letterCharCount.textContent = `${sampleLetter.length} karakter`;

    // Ensure mode 1 with template 1A
    updateModeUI('1');
    updateTemplateUI('1a');

    showToast('✨ Data contoh romantis berhasil diisi!');
  });

  /* ============================================================
     5. Tombol "Kunci Brankas & Lihat Preview"
     ============================================================ */
  btnLockAndPreview.addEventListener('click', () => {
    audio.playPop();
    updateCreatorPinState();

    if (!state.userName) {
      showToast('⚠️ Masukkan Nama Kamu dulu ya sayang!');
      inputUserName.focus();
      return;
    }
    if (!state.partnerName) {
      showToast('⚠️ Masukkan Nama Pasanganmu dulu ya!');
      inputPartnerName.focus();
      return;
    }
    if (!state.pin || state.pin.length !== 6) {
      showToast('⚠️ PIN Tanggal Jadian harus pas 6 digit angka!');
      pinDigits[0].focus();
      return;
    }
    if (!state.hint) {
      showToast('⚠️ Jangan lupa isi petunjuk lucu untuk pasanganmu!');
      inputHint.focus();
      return;
    }
    if (!state.secretLetter) {
      showToast('⚠️ Tulis surat rahasiamu dulu agar brankas berisi pesan manis!');
      inputSecretLetter.focus();
      return;
    }

    // Play lock sound & lock vault
    audio.playLockSound();
    switchToLockedVaultMode();
    showToast('🔒 Brankas Cinta Berhasil Dikunci!');
  });

  function switchToLockedVaultMode() {
    state.isLockedMode = true;
    state.enteredPin = '';
    updateKeypadDots();

    // Reset Padlock to bouncing locked state
    if (heartPadlockEl) {
      heartPadlockEl.classList.remove('unlocked');
      heartPadlockEl.classList.add('bouncing');
    }

    // Hide teasing alert
    if (teasingAlertContainer) {
      teasingAlertContainer.classList.add('hidden');
    }

    // Hide vinyl widget when locked
    if (miniVinylWidget) {
      miniVinylWidget.classList.add('hidden');
      miniVinylWidget.classList.remove('flex');
    }

    // Update Personal Greeting for Partner
    if (vaultPartnerGreeting) {
      vaultPartnerGreeting.textContent = state.partnerName || 'Sayangku';
    }
    if (vaultUserGreeting) {
      vaultUserGreeting.textContent = state.userName || 'Pasanganmu';
    }
    if (vaultHintAuthor) {
      vaultHintAuthor.textContent = state.userName || 'Pasanganmu';
    }

    // Switch view
    creatorSection.classList.add('hidden');
    unlockedViewSection.classList.add('hidden');
    lockedVaultSection.classList.remove('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (btnReturnToEdit) btnReturnToEdit.classList.remove('hidden');
    if (btnShareVaultFloating) btnShareVaultFloating.classList.remove('hidden');

    saveToUrlHash();
  }

  function switchToCreatorMode() {
    state.isLockedMode = false;
    audio.stopMusic();

    if (miniVinylWidget) {
      miniVinylWidget.classList.add('hidden');
      miniVinylWidget.classList.remove('flex');
    }

    lockedVaultSection.classList.add('hidden');
    unlockedViewSection.classList.add('hidden');
    creatorSection.classList.remove('hidden');

    if (btnReturnToEdit) btnReturnToEdit.classList.add('hidden');
    if (btnShareVaultFloating) btnShareVaultFloating.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  btnReturnToEdit.addEventListener('click', () => {
    audio.playPop();
    switchToCreatorMode();
  });

  if (heartPadlockEl) {
    heartPadlockEl.addEventListener('click', () => {
      audio.playKeypad(5);
      heartPadlockEl.classList.add('scale-110');
      setTimeout(() => heartPadlockEl.classList.remove('scale-110'), 250);
    });
  }

  /* ============================================================
     6. Mode Brankas Terkunci - Keypad & PIN Indicator Dots
     ============================================================ */
  function updateKeypadDots() {
    const dots = document.querySelectorAll('.pin-indicator-dot');
    dots.forEach((dot, idx) => {
      if (idx < state.enteredPin.length) {
        dot.classList.add('filled');
        dot.innerHTML = '<span class="animate-heartbeat text-rose-500">❤️</span>';
      } else {
        dot.classList.remove('filled');
        dot.innerHTML = '';
      }
    });
  }

  // Keypad Number Buttons (0-9)
  document.querySelectorAll('.keypad-num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const num = btn.dataset.num;
      handlePinDigitInput(num);
    });
  });

  // Physical Keyboard listener on Lock Screen
  window.addEventListener('keydown', (e) => {
    if (!state.isLockedMode || !lockedVaultSection || lockedVaultSection.classList.contains('hidden')) {
      return;
    }

    if (/^[0-9]$/.test(e.key)) {
      handlePinDigitInput(e.key);
    } else if (e.key === 'Backspace') {
      handlePinBackspace();
    } else if (e.key === 'Escape') {
      closeHintModal();
    }
  });

  function handlePinDigitInput(digit) {
    if (state.enteredPin.length >= 6) return;

    audio.playKeypad(parseInt(digit));
    state.enteredPin += digit;
    updateKeypadDots();

    // Hide previous teasing message as soon as user types
    if (teasingAlertContainer && !teasingAlertContainer.classList.contains('hidden')) {
      teasingAlertContainer.classList.add('hidden');
    }

    if (state.enteredPin.length === 6) {
      setTimeout(() => {
        checkEnteredPin();
      }, 180);
    }
  }

  function handlePinBackspace() {
    if (state.enteredPin.length > 0) {
      audio.playPop();
      state.enteredPin = state.enteredPin.slice(0, -1);
      updateKeypadDots();
    }
  }

  const btnKeypadDelete = document.getElementById('btnKeypadDelete');
  if (btnKeypadDelete) {
    btnKeypadDelete.addEventListener('click', handlePinBackspace);
  }

  const btnKeypadClear = document.getElementById('btnKeypadClear');
  if (btnKeypadClear) {
    btnKeypadClear.addEventListener('click', () => {
      audio.playPop();
      state.enteredPin = '';
      updateKeypadDots();
      if (teasingAlertContainer) teasingAlertContainer.classList.add('hidden');
    });
  }

  /* ============================================================
     PIN Verification: Success Climax vs Comical Wrong Roast
     ============================================================ */
  function checkEnteredPin() {
    if (state.enteredPin === state.pin) {
      // 1. Shackle flips open on Padlock
      if (heartPadlockEl) {
        heartPadlockEl.classList.remove('bouncing');
        heartPadlockEl.classList.add('unlocked');
      }

      // 2. Play celebratory harp glissando
      audio.playUnlockCelebration();

      // 3. Trigger Grand Confetti Cannon (hearts & sakura across the screen)
      atmosphere.triggerRomanticConfetti();

      // 4. Brief emotional pause before revealing the Unlocked Sanctuary
      setTimeout(() => {
        showUnlockCelebration();
      }, 700);

    } else {
      // WRONG PIN: Shake, Womp-Womp & Random Teasing Roast
      audio.playWrongPIN();
      shakeVaultKeypad();

      const roastMsg = teasingRoasts[Math.floor(Math.random() * teasingRoasts.length)];
      if (teasingAlertContainer && teasingAlertText) {
        teasingAlertText.textContent = roastMsg;
        teasingAlertContainer.classList.remove('hidden');
        
        const alertBox = teasingAlertContainer.firstElementChild;
        if (alertBox) {
          alertBox.classList.remove('teasing-alert-enter');
          void alertBox.offsetWidth;
          alertBox.classList.add('teasing-alert-enter');
        }
      }

      showToast(roastMsg);

      setTimeout(() => {
        state.enteredPin = '';
        updateKeypadDots();
      }, 750);
    }
  }

  function shakeVaultKeypad() {
    const card = document.getElementById('vaultSafeCard');
    if (card) {
      card.classList.add('animate-shake');
      setTimeout(() => {
        card.classList.remove('animate-shake');
      }, 550);
    }
  }

  /* ============================================================
     7. Hint Modal Display
     ============================================================ */
  btnVaultHint.addEventListener('click', () => {
    audio.playPop();
    hintModalText.textContent = state.hint || 'Tidak ada petunjuk yang disiapkan!';
    hintModal.classList.remove('hidden');
    hintModal.classList.add('flex');
  });

  function closeHintModal() {
    hintModal.classList.add('hidden');
    hintModal.classList.remove('flex');
  }

  btnCloseHint.addEventListener('click', () => {
    audio.playPop();
    closeHintModal();
  });

  hintModal.addEventListener('click', (e) => {
    if (e.target === hintModal) {
      closeHintModal();
    }
  });

  /* ============================================================
     8. Mode Brankas Terbuka (Unlocked Screen)
     ============================================================ */
  function showUnlockCelebration() {
    lockedVaultSection.classList.add('hidden');
    unlockedViewSection.classList.remove('hidden');

    // Populate Couple Names
    const unCoupleNames = document.getElementById('unlockedCoupleNames');
    if (unCoupleNames) {
      unCoupleNames.textContent = `${state.userName} ❤️ ${state.partnerName}`;
    }

    // Populate Polaroid Image
    polaroid.syncToUnlockedCanvas();

    // Populate Handwritten Caption
    const unCaption = document.getElementById('unlockedPolaroidCaption');
    if (unCaption) {
      unCaption.textContent = polaroid.captionText;
    }

    // Trigger Entrance animation on Polaroid
    if (unlockedPolaroidCard) {
      unlockedPolaroidCard.classList.remove('polaroid-entrance');
      void unlockedPolaroidCard.offsetWidth;
      unlockedPolaroidCard.classList.add('polaroid-entrance');
    }

    // Start Secret Letter Typewriter Effect
    startTypewriter(state.secretLetter);

    // Start Romantic Music & Show Mini Vinyl Player Widget
    audio.startMusic(state.musicMood, state.customMusicUrl);
    if (miniVinylWidget) {
      miniVinylWidget.classList.remove('hidden');
      miniVinylWidget.classList.add('flex');
      updateVinylUI(true);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('🎉 Brankas Terbuka! Selamat merayakan cinta kalian! 💖');
  }

  // Mini Vinyl Player UI Controller
  function updateVinylUI(isPlaying) {
    if (!miniVinylWidget) return;
    if (vinylMoodTitle) vinylMoodTitle.textContent = getMoodTitle(state.musicMood);

    if (isPlaying) {
      if (vinylDiscRecord) vinylDiscRecord.classList.remove('vinyl-paused');
      if (vinylTonearm) vinylTonearm.classList.add('playing');
      if (btnVinylPlayPause) btnVinylPlayPause.textContent = '⏸️';
    } else {
      if (vinylDiscRecord) vinylDiscRecord.classList.add('vinyl-paused');
      if (vinylTonearm) vinylTonearm.classList.remove('playing');
      if (btnVinylPlayPause) btnVinylPlayPause.textContent = '▶️';
    }

    if (btnVinylMute) {
      btnVinylMute.textContent = audio.isMuted ? '🔇' : '🔊';
    }
  }

  function toggleVinylPlayback() {
    audio.playPop();
    const isPlaying = audio.togglePlayPause(state.musicMood, state.customMusicUrl);
    updateVinylUI(isPlaying);
  }

  if (btnToggleVinylDisc) btnToggleVinylDisc.addEventListener('click', toggleVinylPlayback);
  if (btnVinylPlayPause) btnVinylPlayPause.addEventListener('click', toggleVinylPlayback);

  if (btnVinylMute) {
    btnVinylMute.addEventListener('click', () => {
      const isMuted = audio.toggleMute();
      btnVinylMute.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  // Polaroid Click-to-Wiggle Interaction
  function handlePolaroidWiggle() {
    if (!unlockedPolaroidCard) return;
    audio.playPop();
    unlockedPolaroidCard.classList.remove('polaroid-wiggle');
    void unlockedPolaroidCard.offsetWidth;
    unlockedPolaroidCard.classList.add('polaroid-wiggle');

    // Burst mini hearts around Polaroid
    const rect = unlockedPolaroidCard.getBoundingClientRect();
    atmosphere.handlePointerBurst({
      clientX: rect.left + rect.width / 2,
      clientY: rect.top + rect.height * 0.45
    });
  }

  if (unlockedPolaroidCard) {
    unlockedPolaroidCard.addEventListener('click', handlePolaroidWiggle);
  }
  if (btnWigglePolaroidHint) {
    btnWigglePolaroidHint.addEventListener('click', handlePolaroidWiggle);
  }

  // Typewriter Streaming Engine
  function startTypewriter(fullText) {
    const letterEl = document.getElementById('unlockedLetterBody');
    const cursorEl = document.getElementById('typewriterCursor');
    if (!letterEl) return;

    if (typewriterTimer) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }

    letterEl.textContent = '';
    if (cursorEl) cursorEl.style.display = 'inline-block';
    typewriterIndex = 0;

    const textToType = fullText || 'Surat cinta rahasia kosong...';
    const speed = 25; // ms per char

    typewriterTimer = setInterval(() => {
      if (typewriterIndex < textToType.length) {
        const char = textToType[typewriterIndex];
        letterEl.textContent += char;
        typewriterIndex++;

        if (char === ' ' || char === '\n' || typewriterIndex % 5 === 0) {
          audio.playTypewriterClick();
        }
      } else {
        finishTypewriter(textToType);
      }
    }, speed);
  }

  function finishTypewriter(fullText) {
    if (typewriterTimer) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
    }
    const letterEl = document.getElementById('unlockedLetterBody');
    const cursorEl = document.getElementById('typewriterCursor');
    if (letterEl) letterEl.textContent = fullText;
    if (cursorEl) cursorEl.style.display = 'inline-block';
  }

  if (btnSkipTypewriter) {
    btnSkipTypewriter.addEventListener('click', () => {
      audio.playPop();
      finishTypewriter(state.secretLetter);
    });
  }

  if (btnReplayTypewriter) {
    btnReplayTypewriter.addEventListener('click', () => {
      audio.playPop();
      startTypewriter(state.secretLetter);
    });
  }

  // Download Instagram Story Card (1080x1920 PNG)
  if (btnDownloadStory) {
    btnDownloadStory.addEventListener('click', async () => {
      audio.playPop();
      btnDownloadStory.disabled = true;
      btnDownloadStory.innerHTML = '<span>⏳</span><span>Menyiapkan Story...</span>';

      try {
        await storyGenerator.downloadStoryCard({
          userName: state.userName || 'Kamu',
          partnerName: state.partnerName || 'Dia',
          pin: state.pin || '140225',
          caption: polaroid.captionText,
          secretLetter: state.secretLetter || 'Aku mencintaimu selamanya...',
          photoCanvas: polaroid.canvas
        });

        atmosphere.triggerRomanticConfetti();
        showToast('📸 Kartu IG Story (1080x1920) berhasil diunduh! Siap upload ke Story 💕');
      } catch (err) {
        console.error('Download error:', err);
        showToast('⚠️ Gagal membuat gambar Story, coba lagi ya!');
      } finally {
        btnDownloadStory.disabled = false;
        btnDownloadStory.innerHTML = '<span>📸</span><span>Simpan Kenangan (IG Story)</span><span>✨</span>';
      }
    });
  }

  // Relock Button inside Unlocked View
  if (btnRelockVault) {
    btnRelockVault.addEventListener('click', () => {
      audio.playLockSound();
      audio.stopMusic();
      switchToLockedVaultMode();
      showToast('🔒 Brankas Dikunci Kembali');
    });
  }

  if (btnEditFromUnlocked) {
    btnEditFromUnlocked.addEventListener('click', () => {
      audio.playPop();
      audio.stopMusic();
      switchToCreatorMode();
    });
  }

  /* ============================================================
     9. Shareable URL Generator (Base64 URL Hash with Compressed Photo)
     ============================================================ */
  function saveToUrlHash() {
    try {
      const photoThumb = polaroid.getCompressedThumbnail(260, 0.55);

      const payload = {
        u: state.userName,
        p: state.partnerName,
        pin: state.pin,
        h: state.hint,
        c: polaroid.captionText,
        l: state.secretLetter,
        m: state.musicMood,
        cm: state.customMusicUrl,
        mode: state.mode || polaroid.mode,
        tmpl: state.template || polaroid.selectedTemplate,
        img: photoThumb
      };

      const jsonStr = JSON.stringify(payload);
      const encoded = btoa(encodeURIComponent(jsonStr));
      window.location.hash = `vault=${encoded}`;
    } catch (e) {
      console.warn('Hash encode error:', e);
    }
  }

  function loadFromUrlHash() {
    if (!window.location.hash.startsWith('#vault=')) return false;

    try {
      const encoded = window.location.hash.replace('#vault=', '');
      const jsonStr = decodeURIComponent(atob(encoded));
      const payload = JSON.parse(jsonStr);

      if (payload.u && payload.pin) {
        state.userName = payload.u;
        state.partnerName = payload.p;
        state.pin = payload.pin;
        state.hint = payload.h;
        state.secretLetter = payload.l;
        state.musicMood = payload.m || 'music_box';
        state.customMusicUrl = payload.cm || '';

        inputUserName.value = state.userName;
        inputPartnerName.value = state.partnerName;
        updateCoupleDisplay();

        state.pin.split('').forEach((d, i) => {
          if (pinDigits[i]) pinDigits[i].value = d;
        });

        inputHint.value = state.hint;
        inputSecretLetter.value = state.secretLetter;
        if (payload.c) {
          polaroid.captionText = payload.c;
          polaroid.updatePolaroidDOMCaption();
        }

        // Restore Mode & Template
        if (payload.mode) {
          updateModeUI(payload.mode);
        }
        if (payload.tmpl) {
          updateTemplateUI(payload.tmpl);
        }

        // Load Composite Photo
        if (payload.img) {
          polaroid.loadComposite(payload.img);
        }

        // Directly open into Locked Vault Mode for the partner without showing creator form!
        switchToLockedVaultMode();
        showToast('💌 Brankas Cinta diterima dari pasanganmu! Masukkan PIN untuk membuka.');
        return true;
      }
    } catch (e) {
      console.warn('Failed to parse vault hash:', e);
    }
    return false;
  }

  function copyShareLink() {
    audio.playPop();
    saveToUrlHash();
    const shareUrl = window.location.href;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('📋 Link Brankas berhasil disalin! Kirimkan ke pasanganmu 💕');
      }).catch(() => {
        prompt('Salin link ini untuk pasanganmu:', shareUrl);
      });
    } else {
      prompt('Salin link ini untuk pasanganmu:', shareUrl);
    }
  }

  if (btnShareVault) btnShareVault.addEventListener('click', copyShareLink);
  if (btnShareVaultFloating) btnShareVaultFloating.addEventListener('click', copyShareLink);

  /* ============================================================
     10. Toast Notification System
     ============================================================ */
  function showToast(message) {
    let toast = document.getElementById('loveVaultToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'loveVaultToast';
      toast.className = 'fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full text-white font-semibold text-xs sm:text-sm shadow-2xl transition-all duration-300 pointer-events-none flex items-center gap-2 max-w-[90vw] text-center justify-center';
      toast.style.background = 'linear-gradient(135deg, #FB6F92, #C9184A)';
      toast.style.boxShadow = '0 12px 28px rgba(251, 111, 146, 0.5)';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0) scale(1)';

    if (window.toastTimer) clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, 20px) scale(0.9)';
    }, 3400);
  }

  // Initial UI state: Mode 1 Foto & Template 1A
  updateModeUI('1');
  updateTemplateUI('1a');

  // Check URL Hash on launch
  loadFromUrlHash();
});
