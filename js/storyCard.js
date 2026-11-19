/**
 * LoveVault - Instagram Story Card Generator (HD 1080x1920)
 * Renders a high-resolution vertical 9:16 (1080 x 1920 px) Instagram Story Card
 * with Polaroid photograph, handwritten caption, celebratory badge, couple names,
 * love letter excerpt, and watermark "LoveVault ❤️".
 * 
 * Features:
 * - Native Web Share API (navigator.share) for direct IG Story sharing on mobile
 * - Automatic direct download fallback on desktop / unsupported browsers
 * - Zero canvas tainting guarantee
 */

class StoryCardGenerator {
  constructor() {
    this.width = 1080;
    this.height = 1920;
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d');
  }

  async downloadStoryCard(data) {
    return this.shareOrDownloadStoryCard(data);
  }

  /**
   * Generates and Shares / Downloads the 1080x1920 IG Story Card
   */
  async shareOrDownloadStoryCard(data) {
    const {
      userName = 'Kamu',
      partnerName = 'Dia',
      pin = '140225',
      caption = 'Hari terindah bersama kamu ❤️',
      secretLetter = 'Aku mencintaimu selamanya...',
      photoCanvas = null
    } = data;

    if (document.fonts) {
      await document.fonts.ready;
    }

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Romantic Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#FFFDF9');   // Warm cream
    bgGrad.addColorStop(0.35, '#FFE5EC'); // Blush pink
    bgGrad.addColorStop(0.72, '#FFB3C6'); // Rose pink
    bgGrad.addColorStop(1, '#FB6F92');    // Deep rose
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Decorative Outer Border Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 4;
    this.drawRoundedRect(ctx, 40, 40, w - 80, h - 80, 40);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 111, 146, 0.4)';
    ctx.lineWidth = 1.5;
    this.drawRoundedRect(ctx, 52, 52, w - 104, h - 104, 32);
    ctx.stroke();

    // 3. Ambient Floating Hearts & Sparkles in Background
    this.drawBackgroundAtmosphere(ctx, w, h);

    // 4. Header Badge: "✨ LOVEVAULT • BUKTI CINTA ABADI ✨"
    const topBadgeY = 135;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(251, 111, 146, 0.35)';
    ctx.shadowBlur = 16;
    this.drawRoundedRect(ctx, w / 2 - 270, topBadgeY - 32, 540, 64, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FFCCD5';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, w / 2 - 270, topBadgeY - 32, 540, 64, 32);
    ctx.stroke();

    ctx.fillStyle = '#C9184A';
    ctx.font = '700 24px "Quicksand", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ LOVEVAULT • BUKTI CINTA ABADI ✨', w / 2, topBadgeY);

    // 5. Header Title & Couple Names
    ctx.fillStyle = '#4A1525';
    ctx.font = '800 64px "Quicksand", sans-serif';
    ctx.fillText('Kunci Cinta Terbuka!', w / 2, 235);

    ctx.fillStyle = '#9D0208';
    ctx.font = '700 52px "Pacifico", "Caveat", cursive';
    ctx.fillText(`${userName}  ❤️  ${partnerName}`, w / 2, 315);

    // 6. Celebratory Achievement Ribbon Badge
    const ribbonY = 385;
    const ribGrad = ctx.createLinearGradient(w / 2 - 260, ribbonY, w / 2 + 260, ribbonY);
    ribGrad.addColorStop(0, '#FB6F92');
    ribGrad.addColorStop(0.5, '#FF8FAB');
    ribGrad.addColorStop(1, '#C9184A');
    ctx.fillStyle = ribGrad;
    ctx.shadowColor = 'rgba(201, 24, 74, 0.4)';
    ctx.shadowBlur = 18;
    this.drawRoundedRect(ctx, w / 2 - 250, ribbonY - 26, 500, 56, 28);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 26px "Quicksand", sans-serif';
    ctx.fillText('🎉 Berhasil Buka LoveVault ❤️', w / 2, ribbonY + 2);

    // 7. Center: Classic 3D Polaroid Card
    const polaroidW = 760;
    const polaroidH = 920;
    const polaroidX = (w - polaroidW) / 2;
    const polaroidY = 460;

    // Polaroid Shadow
    ctx.shadowColor = 'rgba(74, 21, 37, 0.28)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 22;
    ctx.fillStyle = '#ffffff';
    this.drawRoundedRect(ctx, polaroidX, polaroidY, polaroidW, polaroidH, 16);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Polaroid Washi Tape Accent
    ctx.fillStyle = 'rgba(255, 179, 198, 0.85)';
    this.drawRoundedRect(ctx, w / 2 - 110, polaroidY - 22, 220, 44, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    this.drawRoundedRect(ctx, w / 2 - 105, polaroidY - 18, 210, 36, 6);
    ctx.stroke();
    ctx.setLineDash([]);

    // Photo Area inside Polaroid
    const maxPhotoW = 680;
    const maxPhotoH = 720;
    const photoCenterX = polaroidX + polaroidW / 2;
    const photoCenterY = polaroidY + 40 + maxPhotoH / 2;

    if (photoCanvas) {
      const srcW = photoCanvas.width || 800;
      const srcH = photoCanvas.height || 800;
      const aspect = srcW / srcH;
      let drawW, drawH;

      if (aspect >= (maxPhotoW / maxPhotoH)) {
        drawW = maxPhotoW;
        drawH = maxPhotoW / aspect;
      } else {
        drawH = maxPhotoH;
        drawW = maxPhotoH * aspect;
      }
      const drawX = photoCenterX - drawW / 2;
      const drawY = photoCenterY - drawH / 2;

      ctx.save();
      this.drawRoundedClip(ctx, drawX, drawY, drawW, drawH, 8);
      ctx.drawImage(photoCanvas, drawX, drawY, drawW, drawH);
      ctx.restore();

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = 2;
      this.drawRoundedRect(ctx, drawX, drawY, drawW, drawH, 8);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#FFE5EC';
      ctx.fillRect(photoCenterX - 340, photoCenterY - 340, 680, 680);
    }

    // Handwritten Caption below Photo
    ctx.fillStyle = '#800F2F';
    ctx.font = '600 48px "Caveat", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption || 'Hari terindah bersama kamu ❤️', w / 2, polaroidY + maxPhotoH + 75);

    // 8. Secret Letter Excerpt Box
    const letterBoxW = 860;
    const letterBoxH = 250;
    const letterBoxX = (w - letterBoxW) / 2;
    const letterBoxY = 1430;

    ctx.shadowColor = 'rgba(100, 30, 50, 0.15)';
    ctx.shadowBlur = 25;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#FFFDF9';
    this.drawRoundedRect(ctx, letterBoxX, letterBoxY, letterBoxW, letterBoxH, 24);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.strokeStyle = '#FFCCD5';
    ctx.lineWidth = 2;
    this.drawRoundedRect(ctx, letterBoxX, letterBoxY, letterBoxW, letterBoxH, 24);
    ctx.stroke();

    // Rose Ribbon Accent
    ctx.fillStyle = '#FB6F92';
    this.drawRoundedRect(ctx, letterBoxX, letterBoxY + 16, 8, letterBoxH - 32, 4);
    ctx.fill();

    // Parchment Title
    ctx.fillStyle = '#C9184A';
    ctx.font = '800 24px "Quicksand", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💌 PESAN RAHASIA DARI HATI', letterBoxX + 32, letterBoxY + 45);

    // Excerpt Text (Formatted cleanly into max 3 lines)
    ctx.fillStyle = '#4A3038';
    ctx.font = '500 28px "Quicksand", sans-serif';
    const cleanLetter = secretLetter.replace(/\n+/g, ' ').trim();
    const excerptLines = this.wrapText(ctx, `"${cleanLetter}"`, 790, 3);
    excerptLines.forEach((line, idx) => {
      ctx.fillText(line, letterBoxX + 32, letterBoxY + 95 + idx * 42);
    });

    // 9. PIN Tanggal Jadian Badge
    const formattedPin = pin.length === 6 
      ? `${pin.slice(0, 2)} • ${pin.slice(2, 4)} • ${pin.slice(4, 6)}`
      : pin;
    
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 28px "Quicksand", sans-serif';
    ctx.fillText(`🔐 Tanggal Jadian Abadi: ${formattedPin}`, w / 2, 1735);

    // 10. Watermark & Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = '700 24px "Quicksand", sans-serif';
    ctx.fillText('LoveVault ❤️ • Diabadikan Bersama Selamanya', w / 2, 1830);

    // 11. Handle Web Share API (Mobile) or File Download (Desktop)
    return await this.exportAndShareOrDownload(userName, partnerName);
  }

  async exportAndShareOrDownload(userName, partnerName) {
    const cleanU = userName.replace(/[^a-zA-Z0-9]/g, '');
    const cleanP = partnerName.replace(/[^a-zA-Z0-9]/g, '');
    const filename = `LoveVault-${cleanU}-${cleanP}-Story.png`;

    const blob = await new Promise((resolve) => {
      this.canvas.toBlob(resolve, 'image/png');
    });

    if (!blob) {
      throw new Error('Canvas export failed');
    }

    const file = new File([blob], filename, { type: 'image/png' });

    // Try Web Share API (native share sheet on Android / iOS)
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'LoveVault Kenangan Kita',
          text: `Brankas cinta ${userName} ❤️ ${partnerName} #LoveVault`
        });
        return { shared: true };
      } catch (err) {
        if (err.name === 'AbortError') {
          return { cancelled: true };
        }
        // Fallback to file download
        this.downloadBlobFile(blob, filename);
        return { downloaded: true };
      }
    } else {
      // Desktop / Web share unsupported fallback
      this.downloadBlobFile(blob, filename);
      return { downloaded: true };
    }
  }

  downloadBlobFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
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

  drawRoundedClip(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    this.drawRoundedRect(ctx, x, y, width, height, radius);
    ctx.clip();
  }

  drawBackgroundAtmosphere(ctx, w, h) {
    const hearts = [
      [120, 220, 28], [940, 260, 32], [80, 680, 24], [1000, 720, 30],
      [140, 1200, 36], [920, 1340, 28], [240, 1750, 26], [840, 1720, 32]
    ];
    hearts.forEach(([x, y, size]) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = `${size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('💖', x, y);
    });

    const sparkles = [
      [200, 200, 8], [880, 210, 10], [90, 520, 7], [990, 600, 9],
      [110, 1100, 8], [970, 1150, 8], [180, 1680, 9], [900, 1680, 9]
    ];
    sparkles.forEach(([x, y, r]) => {
      ctx.fillStyle = '#FFD166';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  wrapText(ctx, text, maxWidth, maxLines) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine ? currentLine + ' ' + words[i] : words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth) {
        if (lines.length === maxLines - 1) {
          currentLine += '...';
          lines.push(currentLine);
          return lines;
        }
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }
    return lines;
  }
}

window.StoryCardGenerator = StoryCardGenerator;
