/**
 * LoveVault - Client-side Polaroid & Multi-Template Processor (HD Upgrade)
 * Supports:
 * - Mode "1 Foto":
 *   1A. Bingkai Abstrak Beige & Bunga Line-Art
 *   1B. Vintage Teddy & Retro Camera
 *   1C. Coquette Pink Ribbon (Satin bow, pearls & soft hearts)
 *   1D. Classic 35mm Film Frame (Analog black film strip & orange markings)
 *   1E. Romantic Floral Scrapbook (Kraft paper, washi tape, dried flower & love stamp)
 * - Mode "2 Foto":
 *   2A. Double Polaroid Cozy Knit (Knit background with plaid ribbon bow)
 *   2B. Sweet Photobooth Strip (Vertical 2-photo strip with cute stickers & branding)
 *   2C. Pinned Corkboard Duo (2 white Polaroids pinned with push-pins & washi tape)
 *   2D. Minimalist Aesthetic Collage (Modern editorial cream-sage asymmetrical layout)
 * 
 * Features:
 * - Ultra HD Rendering (min 1200x1500 px / 1400x1400 px)
 * - ImageSmoothingEnabled & ImageSmoothingQuality = 'high'
 * - Mathematically exact object-fit: cover cropping (anti-gepeng & anti-melar)
 * - Zero CORS / Local asset safe execution
 */

class PolaroidProcessor {
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'polaroidCanvas';
    this.captionInputId = options.captionInputId || 'polaroidCaptionInput';
    
    this.mode = '1'; // '1' or '2'
    this.selectedTemplate = '1a'; // '1a','1b','1c','1d','1e','2a','2b','2c','2d'
    this.currentFilter = 'romantic'; // 'romantic', 'vintage', 'original'
    this.captionText = 'Hari terindah bersama kamu ❤️';

    this.photo1 = null; // Image element or Canvas (HD)
    this.photo2 = null; // Image element or Canvas (HD)

    this.templateImages = {
      '1a': null,
      '1b': null,
      '1c': null,
      '1d': null,
      '1e': null,
      '2a': null,
      '2b': null,
      '2c': null,
      '2d': null,
      'ribbon2a': null
    };

    this.templatesLoaded = false;
    this.init();
  }

  async init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Preload template images
    await this.preloadTemplates();

    // Generate romantic default placeholders for Photo 1 & Photo 2
    this.photo1 = this.createDefaultSilhouette(1);
    this.photo2 = this.createDefaultSilhouette(2);

    // Initial render
    this.render();

    // Listen to caption changes
    const captionInput = document.getElementById(this.captionInputId);
    if (captionInput) {
      captionInput.addEventListener('input', (e) => {
        this.captionText = e.target.value;
        this.updatePolaroidDOMCaption();
      });
    }
  }

  preloadTemplates() {
    return new Promise((resolve) => {
      const keys = ['1a', '1b', '1c', '1d', '1e', '2a', '2b', '2c', '2d', 'ribbon2a'];
      let loadedCount = 0;

      const checkDone = () => {
        loadedCount++;
        if (loadedCount === keys.length) {
          this.templatesLoaded = true;
          resolve();
        }
      };

      keys.forEach((key) => {
        let src = '';
        if (window.LOVEVAULT_TEMPLATES && window.LOVEVAULT_TEMPLATES[key]) {
          src = window.LOVEVAULT_TEMPLATES[key];
        } else if (['1c', '1d', '1e', '2b', '2c', '2d'].includes(key)) {
          src = `assets/template-${key}.svg`;
        } else if (key === '1b' || key === '2a') {
          src = `assets/template-${key}.jpg`;
        } else {
          src = `assets/template-${key}.png`;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.templateImages[key] = img;
          checkDone();
        };
        img.onerror = () => {
          // If svg/jpg fallback needed, continue smoothly
          checkDone();
        };
        img.src = src;
      });
    });
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === '2') {
      if (!['2a', '2b', '2c', '2d'].includes(this.selectedTemplate)) {
        this.selectedTemplate = '2a';
      }
    } else {
      if (!['1a', '1b', '1c', '1d', '1e'].includes(this.selectedTemplate)) {
        this.selectedTemplate = '1a';
      }
    }
    this.render();
  }

  setTemplate(templateId) {
    this.selectedTemplate = templateId;
    if (templateId.startsWith('2')) {
      this.mode = '2';
    } else {
      this.mode = '1';
    }
    this.render();
  }

  setFilter(filterName) {
    this.currentFilter = filterName;
    this.render();
  }

  /**
   * Load Photo in Full HD (Maintains min 1080px, max 1800px with 0.90 quality)
   */
  loadPhotoFile(file, slot = 1, callback) {
    if (!file || !file.type.match('image.*')) {
      alert('Harap pilih file gambar yang valid (JPG, PNG, atau WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawImg = new Image();
      rawImg.onload = () => {
        // High Definition Rescaling
        const maxDim = 1800;
        let w = rawImg.width;
        let h = rawImg.height;

        if (Math.max(w, h) > maxDim) {
          const scale = maxDim / Math.max(w, h);
          w = Math.round(w * scale);
          h = Math.round(h * scale);
        }

        const hdCanvas = document.createElement('canvas');
        hdCanvas.width = w;
        hdCanvas.height = h;
        const hdCtx = hdCanvas.getContext('2d');
        hdCtx.imageSmoothingEnabled = true;
        hdCtx.imageSmoothingQuality = 'high';
        hdCtx.drawImage(rawImg, 0, 0, w, h);

        const hdProcessedImg = new Image();
        hdProcessedImg.onload = () => {
          if (slot === 2) {
            this.photo2 = hdProcessedImg;
          } else {
            this.photo1 = hdProcessedImg;
          }
          this.render();
          if (typeof callback === 'function') callback();
        };
        // Encode in high quality WebP (fallback to original dataURL)
        try {
          hdProcessedImg.src = hdCanvas.toDataURL('image/webp', 0.90);
        } catch (e) {
          hdProcessedImg.src = event.target.result;
        }
      };
      rawImg.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Main Render Coordinator in HD
   */
  render() {
    if (!this.canvas) return;

    // Route to appropriate HD template renderer
    switch (this.selectedTemplate) {
      case '1a': this.renderTemplate1A(); break;
      case '1b': this.renderTemplate1B(); break;
      case '1c': this.renderTemplate1C(); break;
      case '1d': this.renderTemplate1D(); break;
      case '1e': this.renderTemplate1E(); break;
      case '2a': this.renderTemplate2A(); break;
      case '2b': this.renderTemplate2B(); break;
      case '2c': this.renderTemplate2C(); break;
      case '2d': this.renderTemplate2D(); break;
      default:   this.renderTemplate1A(); break;
    }

    // Sync to unlocked canvas
    this.syncToUnlockedCanvas();
  }

  setupHDContext(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, w, h);
    return ctx;
  }

  /* ============================================================
     TEMPLATE 1A: Bingkai Beige Abstrak & Bunga Line-Art (HD)
     ============================================================ */
  renderTemplate1A() {
    const W = 1400;
    const H = 1400; // 1:1 HD
    const ctx = this.setupHDContext(W, H);

    const targetX = 0.25 * W;
    const targetY = 0.145 * H;
    const targetW = 0.50 * W;
    const targetH = 0.60 * H;

    // 1. Draw photo under the frame
    if (this.photo1) {
      this.drawFilteredImage(ctx, this.photo1, targetX, targetY, targetW, targetH);
    }

    // 2. Draw template 1A on top
    const tImg = this.templateImages['1a'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 1B: Vintage Teddy & Retro Camera (HD)
     ============================================================ */
  renderTemplate1B() {
    const W = 1200;
    const H = 1500; // 4:5 HD
    const ctx = this.setupHDContext(W, H);

    // 1. Base template
    const tImg = this.templateImages['1b'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Gadget screen aperture
    const targetX = 0.122 * W;
    const targetY = 0.318 * H;
    const targetW = 0.412 * W;
    const targetH = 0.382 * H;

    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, targetX, targetY, targetW, targetH, 24);
      this.drawFilteredImage(ctx, this.photo1, targetX, targetY, targetW, targetH);
      
      // Subtle vintage radial shadow
      const innerGlow = ctx.createRadialGradient(
        targetX + targetW / 2, targetY + targetH / 2, targetW * 0.35,
        targetX + targetW / 2, targetY + targetH / 2, targetW * 0.65
      );
      innerGlow.addColorStop(0, 'rgba(0,0,0,0)');
      innerGlow.addColorStop(1, 'rgba(60, 20, 10, 0.25)');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(targetX, targetY, targetW, targetH);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = 'rgba(74, 30, 15, 0.4)';
      ctx.lineWidth = 3;
      this.drawRoundedRect(ctx, targetX, targetY, targetW, targetH, 24);
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ============================================================
     TEMPLATE 1C: Coquette Pink Ribbon (NEW HD)
     ============================================================ */
  renderTemplate1C() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Photo window: x: 135, y: 180, w: 930, h: 1080
    const px = 135, py = 180, pw = 930, ph = 1080;

    // Draw photo first
    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, px, py, pw, ph, 32);
      this.drawFilteredImage(ctx, this.photo1, px, py, pw, ph);
      ctx.restore();
    }

    // Draw SVG overlay on top (frame, pearls, ribbon bow, lace, banner)
    const tImg = this.templateImages['1c'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 1D: Classic 35mm Film Frame (NEW HD)
     ============================================================ */
  renderTemplate1D() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Center film aperture: x: 132, y: 150, w: 936, h: 1185
    const px = 132, py = 150, pw = 936, ph = 1185;

    // Draw photo first
    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, px, py, pw, ph, 16);
      this.drawFilteredImage(ctx, this.photo1, px, py, pw, ph);
      ctx.restore();
    }

    // Draw Film frame overlay (sprockets, orange text, light leak)
    const tImg = this.templateImages['1d'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 1E: Romantic Floral Scrapbook (NEW HD)
     ============================================================ */
  renderTemplate1E() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Draw Kraft Paper Base & Photo Card
    const tImg = this.templateImages['1e'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }

    // Draw Photo inside tilted frame: center roughly x: 600, y: 720, w: 850, h: 885, rot: -1.8deg
    if (this.photo1) {
      ctx.save();
      ctx.translate(600, 720);
      ctx.rotate(-1.8 * Math.PI / 180);
      const pw = 852, ph = 885;
      const px = -pw / 2;
      const py = -ph / 2 - 45;
      this.drawRoundedClip(ctx, px, py, pw, ph, 10);
      this.drawFilteredImage(ctx, this.photo1, px, py, pw, ph);
      ctx.restore();
    }

    // Redraw Stamp, Tape & Floral accents on top
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 2A: Double Polaroid Cozy Knit (HD)
     ============================================================ */
  renderTemplate2A() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // 1. Base knit template
    const tImg = this.templateImages['2a'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#E8D5C4';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Photo 1 (Top-Left Polaroid)
    if (this.photo1) {
      const f1X = 0.185 * W;
      const f1Y = 0.135 * H;
      const f1W = 0.375 * W;
      const f1H = 0.385 * H;
      const f1Rot = -1.5 * Math.PI / 180;

      ctx.save();
      ctx.translate(f1X + f1W / 2, f1Y + f1H / 2);
      ctx.rotate(f1Rot);
      ctx.translate(-f1W / 2, -f1H / 2);
      this.drawFilteredImage(ctx, this.photo1, 0, 0, f1W, f1H);
      ctx.restore();
    }

    // 3. Photo 2 (Bottom-Right Polaroid)
    const photoToDraw2 = this.photo2 || this.photo1;
    if (photoToDraw2) {
      const f2X = 0.495 * W;
      const f2Y = 0.485 * H;
      const f2W = 0.365 * W;
      const f2H = 0.360 * H;
      const f2Rot = 4.5 * Math.PI / 180;

      ctx.save();
      ctx.translate(f2X + f2W / 2, f2Y + f2H / 2);
      ctx.rotate(f2Rot);
      ctx.translate(-f2W / 2, -f2H / 2);
      this.drawFilteredImage(ctx, photoToDraw2, 0, 0, f2W, f2H);
      ctx.restore();
    }

    // 4. Plaid Ribbon Bow Overlay on Top
    const ribbonImg = this.templateImages['ribbon2a'];
    if (ribbonImg) {
      ctx.drawImage(ribbonImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 2B: Sweet Photobooth Strip (NEW HD)
     ============================================================ */
  renderTemplate2B() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Photo 1 (Top): x: 144, y: 150, w: 912, h: 519, r: 24
    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, 144, 150, 912, 519, 24);
      this.drawFilteredImage(ctx, this.photo1, 144, 150, 912, 519);
      ctx.restore();
    }

    // Photo 2 (Bottom): x: 144, y: 798, w: 912, h: 519, r: 24
    const p2 = this.photo2 || this.photo1;
    if (p2) {
      ctx.save();
      this.drawRoundedClip(ctx, 144, 798, 912, 519, 24);
      this.drawFilteredImage(ctx, p2, 144, 798, 912, 519);
      ctx.restore();
    }

    // Draw Photobooth Strip Frame & Doodles on Top
    const tImg = this.templateImages['2b'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 2C: Pinned Corkboard Duo (NEW HD)
     ============================================================ */
  renderTemplate2C() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Draw background base
    const tImg = this.templateImages['2c'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }

    // Polaroid 1 (Top Left, Tilted -3.5 deg): cx: 405, cy: 450, w: 543, h: 525
    if (this.photo1) {
      ctx.save();
      ctx.translate(405, 450);
      ctx.rotate(-3.5 * Math.PI / 180);
      const pw = 543, ph = 525;
      this.drawRoundedClip(ctx, -pw/2, -ph/2 - 25, pw, ph, 8);
      this.drawFilteredImage(ctx, this.photo1, -pw/2, -ph/2 - 25, pw, ph);
      ctx.restore();
    }

    // Polaroid 2 (Bottom Right, Tilted +3.8 deg): cx: 780, cy: 1050, w: 543, h: 525
    const p2 = this.photo2 || this.photo1;
    if (p2) {
      ctx.save();
      ctx.translate(780, 1050);
      ctx.rotate(3.8 * Math.PI / 180);
      const pw = 543, ph = 525;
      this.drawRoundedClip(ctx, -pw/2, -ph/2 - 25, pw, ph, 8);
      this.drawFilteredImage(ctx, p2, -pw/2, -ph/2 - 25, pw, ph);
      ctx.restore();
    }

    // Draw pins, washi tape & note on top
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /* ============================================================
     TEMPLATE 2D: Minimalist Aesthetic Collage (NEW HD)
     ============================================================ */
  renderTemplate2D() {
    const W = 1200;
    const H = 1500;
    const ctx = this.setupHDContext(W, H);

    // Photo 1 (Hero Portrait Left): x: 114, y: 243, w: 522, h: 999, r: 18
    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, 114, 243, 522, 999, 18);
      this.drawFilteredImage(ctx, this.photo1, 114, 243, 522, 999);
      ctx.restore();
    }

    // Photo 2 (Square/Landscape Right): x: 726, y: 393, w: 360, h: 489, r: 15
    const p2 = this.photo2 || this.photo1;
    if (p2) {
      ctx.save();
      this.drawRoundedClip(ctx, 726, 393, 360, 489, 15);
      this.drawFilteredImage(ctx, p2, 726, 393, 360, 489);
      ctx.restore();
    }

    // Draw Minimalist frames, typography & accents on top
    const tImg = this.templateImages['2d'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /**
   * Mathematically Exact Object-Fit: Cover Cropping (HD, Anti-Gepeng, Anti-Melar)
   */
  drawFilteredImage(ctx, img, dx, dy, dw, dh) {
    if (!img) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = dw;
    tempCanvas.height = dh;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.imageSmoothingEnabled = true;
    tCtx.imageSmoothingQuality = 'high';

    const srcW = img.naturalWidth || img.videoWidth || img.width || dw;
    const srcH = img.naturalHeight || img.videoHeight || img.height || dh;

    // Mathematical Cover: max ratio prevents stretching & keeps sharpest crop
    const scale = Math.max(dw / srcW, dh / srcH);
    const sWidth = dw / scale;
    const sHeight = dh / scale;
    const sx = (srcW - sWidth) / 2;
    const sy = (srcH - sHeight) / 2;

    tCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dw, dh);

    // Apply color tone filter
    this.applyToneFilter(tCtx, dw, dh);

    // Render to target context
    ctx.drawImage(tempCanvas, dx, dy, dw, dh);
  }

  applyToneFilter(ctx, w, h) {
    if (this.currentFilter === 'original') return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      if (this.currentFilter === 'romantic') {
        // Warm peachy rose glow
        r = Math.min(255, r * 1.06 + 12);
        g = Math.min(255, g * 0.98 + 4);
        b = Math.min(255, b * 0.96 + 8);
      } else if (this.currentFilter === 'vintage') {
        // Nostalgic sepia touch
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = Math.min(255, gray + 28);
        g = Math.min(255, gray + 14);
        b = Math.min(255, gray * 0.88);
      }

      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  drawRoundedClip(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    this.drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  createDefaultSilhouette(variant = 1) {
    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 600;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 600);
    if (variant === 1) {
      grad.addColorStop(0, '#FFE5EC');
      grad.addColorStop(0.4, '#FFB3C6');
      grad.addColorStop(0.75, '#FB6F92');
      grad.addColorStop(1, '#9D0208');
    } else {
      grad.addColorStop(0, '#E8D5C4');
      grad.addColorStop(0.4, '#D0B8A8');
      grad.addColorStop(0.75, '#8D7B68');
      grad.addColorStop(1, '#4A3B32');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 600);

    // Glowing Sun/Moon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(300, 300, 90, 0, Math.PI * 2);
    ctx.fill();

    // Couple silhouette
    ctx.fillStyle = variant === 1 ? '#2B0B16' : '#1F1713';
    ctx.beginPath();
    ctx.arc(275, 375, 22, 0, Math.PI * 2);
    ctx.arc(325, 382, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(240, 540);
    ctx.quadraticCurveTo(260, 405, 275, 405);
    ctx.quadraticCurveTo(300, 402, 325, 408);
    ctx.quadraticCurveTo(345, 405, 365, 540);
    ctx.closePath();
    ctx.fill();

    return c;
  }

  syncToUnlockedCanvas() {
    const unCanvas = document.getElementById('unlockedPolaroidCanvas');
    if (unCanvas && this.canvas) {
      unCanvas.width = this.canvas.width;
      unCanvas.height = this.canvas.height;
      const uCtx = unCanvas.getContext('2d');
      uCtx.imageSmoothingEnabled = true;
      uCtx.imageSmoothingQuality = 'high';
      uCtx.drawImage(this.canvas, 0, 0);
    }
  }

  updatePolaroidDOMCaption() {
    const el = document.getElementById('polaroidDisplayCaption');
    if (el) {
      el.textContent = this.captionText || 'Tulis pesan manismu... ✨';
    }
    const unEl = document.getElementById('unlockedPolaroidCaption');
    if (unEl) {
      unEl.textContent = this.captionText || 'Tulis pesan manismu... ✨';
    }
  }

  /**
   * Export HD photos for Cloud JSON Storage
   */
  getShareablePhotosHD() {
    const res = { i1: '', i2: '' };
    const exportHD = (img) => {
      if (!img) return '';
      try {
        const c = document.createElement('canvas');
        const maxD = 1200;
        const w = img.naturalWidth || img.width || 800;
        const h = img.naturalHeight || img.height || 800;
        const scale = Math.min(1, maxD / Math.max(w, h));
        c.width = Math.round(w * scale);
        c.height = Math.round(h * scale);
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, c.width, c.height);
        return c.toDataURL('image/webp', 0.88);
      } catch (e) {
        return '';
      }
    };

    if (this.photo1) res.i1 = exportHD(this.photo1);
    if (this.mode === '2' && this.photo2) res.i2 = exportHD(this.photo2);
    return res;
  }

  /**
   * Load HD photos from shared payload and redraw full template in HD
   */
  async loadPhotosFromShare(i1, i2, mode, template) {
    if (mode) this.setMode(mode);
    if (template) this.setTemplate(template);

    if (!this.templatesLoaded) {
      await this.preloadTemplates();
    }

    const loadImg = (src) => {
      return new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });
    };

    const [loaded1, loaded2] = await Promise.all([
      loadImg(i1),
      loadImg(i2)
    ]);

    if (loaded1) this.photo1 = loaded1;
    if (loaded2) this.photo2 = loaded2;

    this.render();
    this.syncToUnlockedCanvas();
  }

  loadComposite(dataUrl, callback) {
    if (!dataUrl) return;
    const img = new Image();
    img.onload = () => {
      this.photo1 = img;
      if (this.canvas) {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        this.ctx.drawImage(img, 0, 0);
        this.syncToUnlockedCanvas();
      }
      if (typeof callback === 'function') callback();
    };
    img.src = dataUrl;
  }
}

window.PolaroidProcessor = PolaroidProcessor;
