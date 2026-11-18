/**
 * LoveVault - Romantic Canvas Background Engine
 * Features: Floating Love Hearts & Drifting Sakura Petals
 * Plus Interactive Heart Sparkle Burst on Click/Tap!
 * Plus Grand Romantic Confetti Cannon Explosion for Tahap 2 Unlocked Celebration!
 */

class RomanticAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.burstParticles = [];
    this.confettiParticles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;
    
    // Config
    this.heartCount = 24;
    this.sakuraCount = 28;
    this.maxBurst = 60;
    
    this.heartColors = [
      'rgba(251, 111, 146, 0.45)', // Deep Rose
      'rgba(255, 143, 171, 0.50)', // Hot Pink
      'rgba(255, 179, 198, 0.55)', // Rose Pink
      'rgba(255, 202, 212, 0.45)', // Soft Rose
      'rgba(255, 229, 236, 0.60)'  // Blush
    ];

    this.confettiColors = [
      '#FB6F92', '#FF8FAB', '#FFB3C6', '#C9184A', '#FFD166', '#FFE5EC', '#FF4D6D'
    ];
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Spawn initial particles
    this.spawnInitialParticles();
    
    // Interactive mouse / touch click burst
    window.addEventListener('pointerdown', (e) => this.handlePointerBurst(e));

    // Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  spawnInitialParticles() {
    this.particles = [];
    
    // Spawn Floating Hearts (Drifting gently upwards)
    for (let i = 0; i < this.heartCount; i++) {
      this.particles.push(this.createHeartParticle(true));
    }
    
    // Spawn Sakura Petals (Falling gently downwards)
    for (let i = 0; i < this.sakuraCount; i++) {
      this.particles.push(this.createSakuraParticle(true));
    }
  }

  createHeartParticle(randomY = false) {
    return {
      type: 'heart',
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 25 + Math.random() * 50,
      size: 10 + Math.random() * 16,
      speedY: 0.35 + Math.random() * 0.55, // Floats upward
      speedX: -0.2 + Math.random() * 0.4,
      swaySpeed: 0.015 + Math.random() * 0.02,
      swayOffset: Math.random() * Math.PI * 2,
      swayWidth: 15 + Math.random() * 25,
      rotation: (Math.random() - 0.5) * 0.5,
      color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
      opacity: 0.35 + Math.random() * 0.45,
      pulseSpeed: 0.02 + Math.random() * 0.03,
      pulseOffset: Math.random() * Math.PI
    };
  }

  createSakuraParticle(randomY = false) {
    return {
      type: 'sakura',
      x: Math.random() * (this.width + 100) - 50,
      y: randomY ? Math.random() * this.height : -20 - Math.random() * 50,
      size: 11 + Math.random() * 13,
      speedY: 0.6 + Math.random() * 0.8, // Drifts downward
      speedX: 0.4 + Math.random() * 0.7, // Wind blow to the right
      angle: Math.random() * Math.PI * 2,
      angularSpeed: 0.01 + Math.random() * 0.02,
      flipAngle: Math.random() * Math.PI * 2,
      flipSpeed: 0.02 + Math.random() * 0.03,
      color1: '#FFE5EC',
      color2: '#FFB3C6',
      opacity: 0.4 + Math.random() * 0.45
    };
  }

  handlePointerBurst(e) {
    const x = e.clientX;
    const y = e.clientY;
    if (x === undefined || y === undefined) return;
    
    const count = 7 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.8 + Math.random() * 3.5;
      this.burstParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 7 + Math.random() * 10,
        color: this.heartColors[Math.floor(Math.random() * this.heartColors.length)],
        life: 1.0,
        decay: 0.022 + Math.random() * 0.025,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.1
      });
    }

    if (this.burstParticles.length > this.maxBurst) {
      this.burstParticles.splice(0, this.burstParticles.length - this.maxBurst);
    }
  }

  /**
   * Tahap 2 Grand Confetti Cannon
   * Spawns hearts, sakura petals, and glittering stars across the entire screen!
   */
  triggerRomanticConfetti() {
    const totalCount = 100;
    const startY = this.height * 0.45;

    for (let i = 0; i < totalCount; i++) {
      // Half from left cannon, half from right cannon
      const fromLeft = i % 2 === 0;
      const startX = fromLeft ? this.width * 0.15 : this.width * 0.85;
      
      const angle = fromLeft 
        ? -Math.PI * 0.2 - Math.random() * Math.PI * 0.35 // launch right & up
        : -Math.PI * 0.8 + Math.random() * Math.PI * 0.35; // launch left & up
      
      const speed = 7 + Math.random() * 11;
      const isSakura = Math.random() > 0.4;

      this.confettiParticles.push({
        type: isSakura ? 'confetti_sakura' : 'confetti_heart',
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 10 + Math.random() * 14,
        color: this.confettiColors[Math.floor(Math.random() * this.confettiColors.length)],
        life: 1.0,
        decay: 0.007 + Math.random() * 0.008, // lingers long and gracefully
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.12,
        flipAngle: Math.random() * Math.PI * 2,
        flipSpeed: 0.04 + Math.random() * 0.06,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.04 + Math.random() * 0.04
      });
    }
  }

  drawHeart(ctx, x, y, size, color, rotation = 0, opacity = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    ctx.beginPath();
    const d = size;
    ctx.moveTo(0, d * 0.3);
    ctx.bezierCurveTo(-d * 0.55, -d * 0.45, -d * 0.95, d * 0.3, 0, d * 0.95);
    ctx.bezierCurveTo(d * 0.95, d * 0.3, d * 0.55, -d * 0.45, 0, d * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawSakuraPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    ctx.scale(1, Math.cos(p.flipAngle)); // 3D flip effect
    ctx.globalAlpha = p.opacity;

    // Gradient for realistic petal look
    const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
    grad.addColorStop(0, p.color1);
    grad.addColorStop(1, p.color2);
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size * 0.7, -p.size * 0.3, p.size * 0.45, p.size * 0.7);
    ctx.quadraticCurveTo(0, p.size * 0.95, -p.size * 0.45, p.size * 0.7);
    ctx.quadraticCurveTo(-p.size * 0.7, -p.size * 0.3, 0, -p.size);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Ambient Background Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      if (p.type === 'heart') {
        p.swayOffset += p.swaySpeed;
        p.pulseOffset += p.pulseSpeed;
        
        const currentX = p.x + Math.sin(p.swayOffset) * p.swayWidth;
        p.y -= p.speedY;

        const pulseScale = 1 + Math.sin(p.pulseOffset) * 0.08;
        const currentSize = p.size * pulseScale;

        this.drawHeart(this.ctx, currentX, p.y, currentSize, p.color, p.rotation, p.opacity);

        if (p.y < -30) {
          Object.assign(p, this.createHeartParticle(false));
          p.y = this.height + 20;
        }
      } 
      else if (p.type === 'sakura') {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.angle) * 0.3;
        p.angle += p.angularSpeed;
        p.flipAngle += p.flipSpeed;

        this.drawSakuraPetal(this.ctx, p);

        if (p.y > this.height + 30 || p.x > this.width + 60) {
          Object.assign(p, this.createSakuraParticle(false));
          p.y = -20;
          p.x = Math.random() * (this.width * 0.8);
        }
      }
    }

    // 2. Interactive Burst Particles (from user taps)
    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const bp = this.burstParticles[i];
      bp.x += bp.vx;
      bp.y += bp.vy;
      bp.vy += 0.08; // Gentle gravity
      bp.vx *= 0.98; // Friction
      bp.life -= bp.decay;
      bp.rotation += bp.rotSpeed;

      if (bp.life <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      this.drawHeart(
        this.ctx, 
        bp.x, 
        bp.y, 
        bp.size * bp.life, 
        bp.color, 
        bp.rotation, 
        bp.life * 0.8
      );
    }

    // 3. Grand Confetti Particles (Tahap 2 Celebration)
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const cp = this.confettiParticles[i];
      cp.x += cp.vx;
      cp.y += cp.vy;
      cp.vy += 0.16; // Gravity
      cp.vx *= 0.985; // Air drag
      cp.rotation += cp.rotSpeed;
      cp.flipAngle += cp.flipSpeed;
      cp.life -= cp.decay;

      // Gentle horizontal sway as it floats down
      cp.swayOffset += cp.swaySpeed;
      const swayX = cp.x + Math.sin(cp.swayOffset) * 2;

      if (cp.life <= 0 || cp.y > this.height + 40) {
        this.confettiParticles.splice(i, 1);
        continue;
      }

      if (cp.type === 'confetti_heart') {
        this.drawHeart(this.ctx, swayX, cp.y, cp.size, cp.color, cp.rotation, cp.life);
      } else {
        this.ctx.save();
        this.ctx.translate(swayX, cp.y);
        this.ctx.rotate(cp.rotation);
        this.ctx.scale(1, Math.cos(cp.flipAngle));
        this.ctx.globalAlpha = cp.life;
        this.ctx.fillStyle = cp.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, cp.size * 0.5, cp.size * 0.8, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
      }
    }

    requestAnimationFrame(this.animate);
  }
}

window.RomanticAtmosphere = RomanticAtmosphere;
