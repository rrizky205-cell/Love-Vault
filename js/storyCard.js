/**
 * LoveVault - Instagram Story Card Generator (Tahap 3)
 * Renders a high-resolution vertical 9:16 (1080 x 1920 px) Instagram Story Card
 * with Polaroid photograph, handwritten caption, celebratory badge, couple names,
 * and love letter excerpt, ready for instant download as a PNG file.
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

  /**
   * Generates and downloads the 1080x1920 IG Story Card
   */
  async downloadStoryCard(data) {
    const {
      userName = 'Kamu',
      partnerName = 'Dia',
      pin = '140225',
      caption = 'Hari terindah bersama kamu ❤️',
      secretLetter = 'Aku mencintaimu selamanya...',
      photoCanvas = null
    } = data;

    // Ensure custom fonts are loaded
    if (document.fonts) {
      await document.fonts.ready;
    }

    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Romantic Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#FFFDF9');   // Soft warm cream
    bgGrad.addColorStop(0.35, '#FFE5EC'); // Blush pink
    bgGrad.addColorStop(0.72, '#FFB3C6'); // Rose pink
    bgGrad.addColorStop(1, '#FB6F92');    // Deep rose
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Decorative Outer Border Frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 4;
    this.drawRoundedRect(ctx, 40, 40, w - 80, h - 80, 40);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 111, 146, 0.4)';
    ctx.lineWidth = 1.5;
    this.drawRoundedRect(ctx, 52, 52, w - 104, h - 104, 32);
    ctx.stroke();

    // 3. Ambient Floating Hearts & Sakura Petals in Background
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
    ctx.setLineDash([]); // reset dash

    // Photo Area (Adaptive to 1:1 or 4:5 Templates)
    const maxPhotoW = 680;
    const maxPhotoH = 720;
    const photoCenterX = polaroidX + polaroidW / 2;
    const photoCenterY = polaroidY + 40 + maxPhotoH / 2;

    if (photoCanvas) {
      const srcW = photoCanvas.width || 600;
      const srcH = photoCanvas.height || 600;
      const aspect = srcW / srcH;
      let drawW, drawH;

      if (aspect >= 1) {
        drawW = maxPhotoW;
        drawH = maxPhotoW / aspect;
      } else {
        drawH = maxPhotoH;
        drawW = Math.min(maxPhotoW, maxPhotoH * aspect);
      }
      const drawX = photoCenterX - drawW / 2;
      const drawY = photoCenterY - drawH / 2;
      ctx.drawImage(photoCanvas, drawX, drawY, drawW, drawH);
    } else {
      ctx.fillStyle = '#FFE5EC';
      ctx.fillRect(photoCenterX - 340, photoCenterY - 340, 680, 680);
    }

    // Photo Border Inner Shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.lineWidth = 2;
    ctx.strokeRect(photoX, photoY, photoSize, photoSize);

    // Handwritten Caption below Photo
    ctx.fillStyle = '#800F2F';
    ctx.font = '600 50px "Caveat", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption || 'Hari terindah bersama kamu ❤️', w / 2, polaroidY + photoSize + 115);

    // 8. Secret Letter Excerpt on Parchment Paper Box
    const letterBoxW = 860;
    const letterBoxH = 260;
    const letterBoxX = (w - letterBoxW) / 2;
    const letterBoxY = 1425;

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

    // Left Rose Ribbon Accent on Parchment
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '600 22px "Quicksand", sans-serif';
    ctx.fillText('lovevault.app • Diabadikan dengan Cinta Abadi 💕', w / 2, 1830);

    // Trigger PNG Download
    this.triggerDownload(userName, partnerName);
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

  drawBackgroundAtmosphere(ctx, w, h) {
    // Floating Hearts
    const hearts = [
      [110, 260, 28, '#FB6F92', 0.35],
      [970, 300, 34, '#FF8FAB', 0.40],
      [90, 780, 24, '#FFCCD5', 0.45],
      [990, 840, 30, '#FB6F92', 0.38],
      [120, 1360, 32, '#FF8FAB', 0.35],
      [960, 1390, 28, '#FFCCD5', 0.42],
      [220, 1780, 36, '#ffffff', 0.45],
      [860, 1780, 36, '#ffffff', 0.45]
    ];

    hearts.forEach(([x, y, size, color, alpha]) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      const d = size;
      ctx.translate(x, y);
      ctx.moveTo(0, d * 0.3);
      ctx.bezierCurveTo(-d * 0.55, -d * 0.45, -d * 0.95, d * 0.3, 0, d * 0.95);
      ctx.bezierCurveTo(d * 0.95, d * 0.3, d * 0.55, -d * 0.45, 0, d * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // Golden Sparkles
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
          // Truncate last line with ellipsis
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

  triggerDownload(userName, partnerName) {
    try {
      this.canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const cleanU = userName.replace(/[^a-zA-Z0-9]/g, '');
        const cleanP = partnerName.replace(/[^a-zA-Z0-9]/g, '');
        a.download = `LoveVault-${cleanU}-${cleanP}-Story.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }, 'image/png');
    } catch (e) {
      console.warn('Canvas blob error:', e);
      // Fallback
      const a = document.createElement('a');
      a.download = `LoveVault-Story.png`;
      a.href = this.canvas.toDataURL('image/png');
      a.click();
    }
  }
}

window.StoryCardGenerator = StoryCardGenerator;
