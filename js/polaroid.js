/**
 * LoveVault - Client-side Polaroid & Multi-Template Processor (Tahap 3 Update)
 * Supports:
 * - Mode "1 Foto": Template 1A (Frame Abstrak Beige & Bunga) & Template 1B (Vintage Teddy & Retro Cam)
 * - Mode "2 Foto": Template 2A (Double Polaroid Cozy Knit)
 * Uses HTML5 Canvas for mathematically exact multi-layer compositing,
 * clipping, rotation, and client-side filtering.
 */

class PolaroidProcessor {
  constructor(options = {}) {
    this.canvasId = options.canvasId || 'polaroidCanvas';
    this.captionInputId = options.captionInputId || 'polaroidCaptionInput';
    
    this.mode = '1'; // '1' or '2'
    this.selectedTemplate = '1a'; // '1a', '1b', or '2a'
    this.currentFilter = 'romantic'; // 'romantic', 'vintage', 'original'
    this.captionText = 'Hari terindah bersama kamu ❤️';

    this.photo1 = null; // Image element or Canvas
    this.photo2 = null; // Image element or Canvas

    this.templateImages = {
      '1a': null,
      '1b': null,
      '2a': null,
      'ribbon2a': null
    };

    this.templatesLoaded = false;
    this.init();
  }

  async init() {
    this.canvas = document.getElementById(this.canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    // Preload template images from Base64 constants
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
      const keys = ['1a', '1b', '2a', 'ribbon2a'];
      let loadedCount = 0;

      const checkDone = () => {
        loadedCount++;
        if (loadedCount === keys.length) {
          this.templatesLoaded = true;
          resolve();
        }
      };

      keys.forEach((key) => {
        const src = (window.LOVEVAULT_TEMPLATES && window.LOVEVAULT_TEMPLATES[key]) 
          ? window.LOVEVAULT_TEMPLATES[key] 
          : `assets/template-${key}.png`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.templateImages[key] = img;
          checkDone();
        };
        img.onerror = () => {
          console.warn(`Template ${key} failed to load, continuing...`);
          checkDone();
        };
        img.src = src;
      });
    });
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === '2') {
      this.selectedTemplate = '2a';
    } else if (this.selectedTemplate === '2a') {
      this.selectedTemplate = '1a';
    }
    this.render();
  }

  setTemplate(templateId) {
    this.selectedTemplate = templateId;
    if (templateId === '2a') {
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

  loadPhotoFile(file, slot = 1, callback) {
    if (!file || !file.type.match('image.*')) {
      alert('Harap pilih file gambar yang valid (JPG, PNG, atau WEBP)!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (slot === 2) {
          this.photo2 = img;
        } else {
          this.photo1 = img;
        }
        this.render();
        if (typeof callback === 'function') callback();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Main Render Coordinator
   */
  render() {
    if (!this.canvas) return;

    if (this.selectedTemplate === '1a') {
      this.renderTemplate1A();
    } else if (this.selectedTemplate === '1b') {
      this.renderTemplate1B();
    } else if (this.selectedTemplate === '2a') {
      this.renderTemplate2A();
    }

    // Sync to unlocked canvas if visible
    this.syncToUnlockedCanvas();
  }

  /**
   * Template 1A: Bingkai Beige Abstrak & Bunga Line-Art
   * Area Foto User: x: 25%, y: 14.5%, width: 50%, height: 60%
   * Bunga line-art di kanan bawah berada di layer atas foto.
   */
  renderTemplate1A() {
    const W = 600;
    const H = 600; // 1:1 Aspect Ratio
    this.canvas.width = W;
    this.canvas.height = H;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    // Target coordinates
    const targetX = 0.25 * W;
    const targetY = 0.145 * H;
    const targetW = 0.50 * W;
    const targetH = 0.60 * H;

    // 1. Draw photo under the frame
    if (this.photo1) {
      this.drawFilteredImage(ctx, this.photo1, targetX, targetY, targetW, targetH);
    }

    // 2. Draw template 1A on top (so flower line-art and beige border are on top)
    const tImg = this.templateImages['1a'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    }
  }

  /**
   * Template 1B: Vintage Teddy & Retro Camera
   * Area Foto User: Kotak layar putih retro perunggu kiri bawah
   * x: 12.2%, y: 31.8%, width: 41.2%, height: 38.2%
   */
  renderTemplate1B() {
    const W = 540;
    const H = 678; // ~399x501 Aspect Ratio
    this.canvas.width = W;
    this.canvas.height = H;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw template base image
    const tImg = this.templateImages['1b'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Target coordinates for gadget screen
    const targetX = 0.122 * W;
    const targetY = 0.318 * H;
    const targetW = 0.412 * W;
    const targetH = 0.382 * H;

    // Draw photo clipped inside retro screen with rounded corners
    if (this.photo1) {
      ctx.save();
      this.drawRoundedClip(ctx, targetX, targetY, targetW, targetH, 12);
      this.drawFilteredImage(ctx, this.photo1, targetX, targetY, targetW, targetH);
      
      // Subtle vintage inner shadow for screen realism
      const innerGlow = ctx.createRadialGradient(
        targetX + targetW / 2, targetY + targetH / 2, targetW * 0.35,
        targetX + targetW / 2, targetY + targetH / 2, targetW * 0.65
      );
      innerGlow.addColorStop(0, 'rgba(0,0,0,0)');
      innerGlow.addColorStop(1, 'rgba(60, 20, 10, 0.22)');
      ctx.fillStyle = innerGlow;
      ctx.fillRect(targetX, targetY, targetW, targetH);
      ctx.restore();

      // Screen border bezel
      ctx.save();
      ctx.strokeStyle = 'rgba(74, 30, 15, 0.35)';
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, targetX, targetY, targetW, targetH, 12);
      ctx.stroke();
      ctx.restore();
    }
  }

  /**
   * Template 2A: Double Polaroid Cozy Knit
   * Foto 1: Polaroid Kiri Atas (x: 18.5%, y: 13.5%, width: 37.5%, height: 38.5%, rot: -1.5deg)
   * Foto 2: Polaroid Kanan Bawah (x: 49.5%, y: 48.5%, width: 36.5%, height: 36%, rot: +4.5deg)
   * Pita kotak-kotak cokelat tetap di layer atas foto.
   */
  renderTemplate2A() {
    const W = 540;
    const H = 678; // ~399x501 Aspect Ratio
    this.canvas.width = W;
    this.canvas.height = H;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw template base image
    const tImg = this.templateImages['2a'];
    if (tImg) {
      ctx.drawImage(tImg, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#D7CCC8';
      ctx.fillRect(0, 0, W, H);
    }

    // 2. Draw Foto 1 (Polaroid Kiri Atas)
    if (this.photo1) {
      const f1X = 0.185 * W;
      const f1Y = 0.135 * H;
      const f1W = 0.375 * W;
      const f1H = 0.385 * H;
      const f1Rot = -1.5 * Math.PI / 180;

      ctx.save();
      // Rotate around center of Polaroid 1
      const cx1 = f1X + f1W / 2;
      const cy1 = f1Y + f1H / 2;
      ctx.translate(cx1, cy1);
      ctx.rotate(f1Rot);
      ctx.translate(-f1W / 2, -f1H / 2);
      this.drawFilteredImage(ctx, this.photo1, 0, 0, f1W, f1H);
      ctx.restore();
    }

    // 3. Draw Foto 2 (Polaroid Kanan Bawah)
    const photoToDraw2 = this.photo2 || this.photo1;
    if (photoToDraw2) {
      const f2X = 0.495 * W;
      const f2Y = 0.485 * H;
      const f2W = 0.365 * W;
      const f2H = 0.360 * H;
      const f2Rot = 4.5 * Math.PI / 180;

      ctx.save();
      // Rotate around center of Polaroid 2
      const cx2 = f2X + f2W / 2;
      const cy2 = f2Y + f2H / 2;
      ctx.translate(cx2, cy2);
      ctx.rotate(f2Rot);
      ctx.translate(-f2W / 2, -f2H / 2);
      this.drawFilteredImage(ctx, photoToDraw2, 0, 0, f2W, f2H);
      ctx.restore();
    }

    // 4. Draw Plaid Ribbon Overlay on Top ("Pita kotak-kotak tetap berada di layer atas foto")
    const ribbonImg = this.templateImages['ribbon2a'];
    if (ribbonImg) {
      ctx.drawImage(ribbonImg, 0, 0, W, H);
    }
  }

  /**
   * Center-crops & draws filtered image into given rectangle
   */
  drawFilteredImage(ctx, img, dx, dy, dw, dh) {
    if (!img) return;

    // Off-screen canvas for filter processing
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = dw;
    tempCanvas.height = dh;
    const tCtx = tempCanvas.getContext('2d');

    const srcW = img.width || dw;
    const srcH = img.height || dh;
    const srcAspect = srcW / srcH;
    const targetAspect = dw / dh;

    let sx, sy, sWidth, sHeight;
    if (srcAspect > targetAspect) {
      sHeight = srcH;
      sWidth = srcH * targetAspect;
      sx = (srcW - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = srcW;
      sHeight = srcW / targetAspect;
      sx = 0;
      sy = (srcH - sHeight) / 2;
    }

    tCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, dw, dh);

    // Apply color filter
    this.applyToneFilter(tCtx, dw, dh);

    // Draw filtered output to destination
    ctx.drawImage(tempCanvas, dx, dy, dw, dh);
  }

  applyToneFilter(ctx, w, h) {
    if (this.currentFilter === 'original') return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (this.currentFilter === 'romantic') {
        data[i] = Math.min(255, r * 1.08 + 12);
        data[i + 1] = Math.min(255, g * 0.98 + 4);
        data[i + 2] = Math.min(255, b * 1.02 + 8);
      } else if (this.currentFilter === 'vintage') {
        const tr = 0.393 * r + 0.769 * g + 0.189 * b;
        const tg = 0.349 * r + 0.686 * g + 0.168 * b;
        const tb = 0.272 * r + 0.534 * g + 0.131 * b;
        data[i] = Math.min(255, tr + 10);
        data[i + 1] = Math.min(255, tg + 5);
        data[i + 2] = Math.min(255, tb);
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  drawRoundedClip(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    this.drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
  }

  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
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
    c.width = 400;
    c.height = 400;
    const ctx = c.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 0, 400);
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
    ctx.fillRect(0, 0, 400, 400);

    // Glowing Sun/Moon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.beginPath();
    ctx.arc(200, 200, 60, 0, Math.PI * 2);
    ctx.fill();

    // Couple silhouette
    ctx.fillStyle = variant === 1 ? '#2B0B16' : '#1F1713';
    ctx.beginPath();
    ctx.arc(185, 250, 15, 0, Math.PI * 2);
    ctx.arc(215, 255, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(160, 360);
    ctx.quadraticCurveTo(175, 270, 185, 270);
    ctx.quadraticCurveTo(200, 268, 215, 272);
    ctx.quadraticCurveTo(230, 270, 245, 360);
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
   * Tahap 3: Compressed Thumbnail for Database-free URL Hash Sharing
   * Resizes canvas composition to ~250px and encodes to JPEG 0.5 (~8-14 KB)
   */
  getCompressedThumbnail(size = 250, quality = 0.5) {
    if (!this.canvas) return '';
    try {
      const thumbCanvas = document.createElement('canvas');
      const aspect = this.canvas.width / this.canvas.height;
      thumbCanvas.width = size;
      thumbCanvas.height = Math.round(size / aspect);
      const tCtx = thumbCanvas.getContext('2d');
      tCtx.drawImage(this.canvas, 0, 0, thumbCanvas.width, thumbCanvas.height);
      return thumbCanvas.toDataURL('image/jpeg', quality);
    } catch (e) {
      console.warn('Failed to compress thumbnail for URL hash:', e);
      return '';
    }
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
