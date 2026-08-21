/* ==========================================================================
   1. PASSWORD & LOCK SCREEN SYSTEM
   ========================================================================== */
const SECRET_CODE = "06"; // Default 2-digit secret password
let enteredCode = "";

const dot1 = document.getElementById('dot1');
const dot2 = document.getElementById('dot2');
const lockCard = document.querySelector('.lock-card');
const passwordScreen = document.getElementById('passwordScreen');
const loadingOverlay = document.getElementById('loadingOverlay');
const mainApp = document.getElementById('mainApp');
const loadingBar = document.getElementById('loadingBar');

// Keypad Button Listener
document.querySelectorAll('.key-btn[data-val]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (enteredCode.length < 2) {
      enteredCode += btn.getAttribute('data-val');
      updateCodeDisplay();
      if (enteredCode.length === 2) {
        verifyCode();
      }
    }
  });
});

const clearBtn = document.getElementById('clearBtn');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    enteredCode = "";
    updateCodeDisplay();
  });
}

const deleteBtn = document.getElementById('deleteBtn');
if (deleteBtn) {
  deleteBtn.addEventListener('click', () => {
    enteredCode = enteredCode.slice(0, -1);
    updateCodeDisplay();
  });
}

function updateCodeDisplay() {
  if (dot1 && dot2) {
    dot1.classList.toggle('filled', enteredCode.length >= 1);
    dot2.classList.toggle('filled', enteredCode.length >= 2);
  }
}

function verifyCode() {
  if (enteredCode === SECRET_CODE) {
    // Correct Password -> Trigger Cinematic Loading
    if (passwordScreen) passwordScreen.classList.add('hidden');
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    startLoadingSequence();
  } else {
    // Wrong Password -> Shake
    if (lockCard) lockCard.classList.add('shake');
    setTimeout(() => {
      if (lockCard) lockCard.classList.remove('shake');
      enteredCode = "";
      updateCodeDisplay();
    }, 450);
  }
}

/* ==========================================================================
   2. CINEMATIC LOADING SEQUENCE
   ========================================================================== */
function startLoadingSequence() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    if (loadingBar) loadingBar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        if (loadingOverlay) loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          if (loadingOverlay) loadingOverlay.classList.add('hidden');
          if (mainApp) mainApp.classList.remove('hidden');
          initMainFeatures();
        }, 800);
      }, 300);
    }
  }, 80);
}

/* ==========================================================================
   3. BACKGROUND UNIVERSE CANVAS (STARS, PARTICLES, BALLOONS, FIREWORKS)
   ========================================================================== */
const uCanvas = document.getElementById('universeCanvas');
if (uCanvas) {
  const uCtx = uCanvas.getContext('2d');

  let uWidth = uCanvas.width = window.innerWidth;
  let uHeight = uCanvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    uWidth = uCanvas.width = window.innerWidth;
    uHeight = uCanvas.height = window.innerHeight;
  });

  const stars = [];
  const floatingHearts = [];
  const fireworks = [];

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * uWidth;
      this.y = Math.random() * uHeight;
      this.size = Math.random() * 1.5;
      this.alpha = Math.random();
      this.speed = Math.random() * 0.015 + 0.005;
    }
    update() {
      this.alpha += this.speed;
      if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
    }
    draw() {
      uCtx.fillStyle = `rgba(255, 255, 255, ${Math.abs(this.alpha)})`;
      uCtx.beginPath();
      uCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      uCtx.fill();
    }
  }

  class FloatingHeart {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * uWidth;
      this.y = uHeight + 30;
      this.size = Math.random() * 14 + 8;
      this.speedY = Math.random() * 1 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.5 ? '#ff2a85' : '#a855f7';
    }
    update() {
      this.y -= this.speedY;
      if (this.y < -30) this.reset();
    }
    draw() {
      uCtx.save();
      uCtx.globalAlpha = this.opacity;
      uCtx.fillStyle = this.color;
      uCtx.beginPath();
      const topCurve = this.size * 0.3;
      uCtx.moveTo(this.x, this.y + topCurve);
      uCtx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurve);
      uCtx.bezierCurveTo(this.x - this.size / 2, this.y + (this.size + topCurve) / 2, this.x, this.y + this.size, this.x, this.y + this.size);
      uCtx.bezierCurveTo(this.x, this.y + this.size, this.x + this.size / 2, this.y + (this.size + topCurve) / 2, this.x + this.size / 2, this.y + topCurve);
      uCtx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurve);
      uCtx.closePath();
      uCtx.fill();
      uCtx.restore();
    }
  }

  for (let i = 0; i < 100; i++) stars.push(new Star());
  for (let i = 0; i < 25; i++) floatingHearts.push(new FloatingHeart());

  function renderUniverse() {
    uCtx.clearRect(0, 0, uWidth, uHeight);
    stars.forEach(s => { s.update(); s.draw(); });
    floatingHearts.forEach(h => { h.update(); h.draw(); });
    
    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].alpha <= 0) fireworks.splice(i, 1);
    }

    requestAnimationFrame(renderUniverse);
  }
  renderUniverse();

  class FireworkParticle {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.decay = Math.random() * 0.02 + 0.015;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.alpha -= this.decay;
    }
    draw() {
      uCtx.save();
      uCtx.globalAlpha = Math.max(0, this.alpha);
      uCtx.fillStyle = this.color;
      uCtx.beginPath();
      uCtx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      uCtx.fill();
      uCtx.restore();
    }
  }

  window.launchFireworks = function() {
    const colors = ['#ff2a85', '#a855f7', '#00f0ff', '#ffd700'];
    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const cx = Math.random() * uWidth;
        const cy = Math.random() * (uHeight * 0.5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let p = 0; p < 40; p++) {
          fireworks.push(new FireworkParticle(cx, cy, color));
        }
      }, f * 300);
    }
  };
}

/* ==========================================================================
   4. INFINITY (∞) LOVE CIRCLE ANIMATION HERO
   ========================================================================== */
const infCanvas = document.getElementById('infinityCanvas');
if (infCanvas) {
  const infCtx = infCanvas.getContext('2d');

  let infWidth, infHeight;
  const textParticles = [];
  const NUM_TEXT_PARTICLES = 120;

  function resizeInfinityCanvas() {
    const stage = document.querySelector('.infinity-stage');
    if (stage) {
      infWidth = infCanvas.width = stage.clientWidth;
      infHeight = infCanvas.height = stage.clientHeight;
    }
  }
  resizeInfinityCanvas();
  window.addEventListener('resize', resizeInfinityCanvas);

  function getInfinityPoint(t, scaleX, scaleY) {
    const sinT = Math.sin(t);
    const cosT = Math.cos(t);
    const denom = 1 + sinT * sinT;
    const x = (scaleX * cosT) / denom;
    const y = (scaleY * sinT * cosT) / denom;
    return { x, y };
  }

  class TextParticle {
    constructor(offsetT) {
      this.t = offsetT;
      this.speed = 0.004;
      this.text = "I Love You ❤️";
    }
    update() {
      this.t += this.speed;
      if (this.t > Math.PI * 2) this.t -= Math.PI * 2;
    }
    draw() {
      const scaleX = infWidth * 0.38;
      const scaleY = infHeight * 0.45;
      const pt = getInfinityPoint(this.t, scaleX, scaleY);
      
      const posX = infWidth / 2 + pt.x;
      const posY = infHeight / 2 + pt.y;

      infCtx.save();
      infCtx.font = "12px Poppins";
      infCtx.fillStyle = `rgba(255, 42, 133, ${0.4 + Math.sin(this.t) * 0.3})`;
      infCtx.shadowColor = "#ff2a85";
      infCtx.shadowBlur = 8;
      infCtx.fillText(this.text, posX, posY);
      infCtx.restore();
    }
  }

  for (let i = 0; i < NUM_TEXT_PARTICLES; i++) {
    textParticles.push(new TextParticle((i / NUM_TEXT_PARTICLES) * Math.PI * 2));
  }

  let orbitT1 = 0;
  let orbitT2 = Math.PI;

  function animateInfinityHero() {
    if (!infWidth) return;
    infCtx.clearRect(0, 0, infWidth, infHeight);

    infCtx.save();
    infCtx.beginPath();
    const scaleX = infWidth * 0.38;
    const scaleY = infHeight * 0.45;
    
    for (let t = 0; t <= Math.PI * 2; t += 0.02) {
      const pt = getInfinityPoint(t, scaleX, scaleY);
      if (t === 0) infCtx.moveTo(infWidth / 2 + pt.x, infHeight / 2 + pt.y);
      else infCtx.lineTo(infWidth / 2 + pt.x, infHeight / 2 + pt.y);
    }
    infCtx.strokeStyle = "rgba(168, 85, 247, 0.25)";
    infCtx.lineWidth = 3;
    infCtx.shadowColor = "#a855f7";
    infCtx.shadowBlur = 15;
    infCtx.stroke();
    infCtx.restore();

    textParticles.forEach(p => { p.update(); p.draw(); });

    orbitT1 += 0.005;
    orbitT2 += 0.005;

    const pt1 = getInfinityPoint(orbitT1, scaleX, scaleY);
    const pt2 = getInfinityPoint(orbitT2, scaleX, scaleY);

    const photo1 = document.getElementById('photoOrbit1');
    const photo2 = document.getElementById('photoOrbit2');

    if (photo1 && photo2) {
      photo1.style.transform = `translate(${infWidth / 2 + pt1.x}px, ${infHeight / 2 + pt1.y}px)`;
      photo2.style.transform = `translate(${infWidth / 2 + pt2.x}px, ${infHeight / 2 + pt2.y}px)`;
    }

    requestAnimationFrame(animateInfinityHero);
  }
  animateInfinityHero();
}

/* ==========================================================================
   5. TYPEWRITER EFFECT & MAIN FEATURES INIT
   ========================================================================== */
function initMainFeatures() {
  const music = document.getElementById('bgMusic');
  if (music) {
    music.play().then(() => {
      updatePlayPauseUI(true);
    }).catch(() => {
      updatePlayPauseUI(false);
    });
  }

  const titleText = "Happy Birthday, My Labibah ❤️";
  const titleElem = document.getElementById('typewriterTitle');
  let charIdx = 0;

  if (titleElem) {
    function typeNextChar() {
      if (charIdx < titleText.length) {
        titleElem.textContent += titleText.charAt(charIdx);
        charIdx++;
        setTimeout(typeNextChar, 80);
      }
    }
    typeNextChar();
  }

  initCountdown();
}

/* ==========================================================================
   6. COUNTDOWN TIMER
   ========================================================================== */
function initCountdown() {
  const loveStartDate = new Date('2024-08-22T00:00:00');

  function updateTimer() {
    const now = new Date();
    const diff = now - loveStartDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    const dElem = document.getElementById('daysNum');
    if (dElem) {
      dElem.textContent = String(days).padStart(2, '0');
      document.getElementById('hoursNum').textContent = String(hours).padStart(2, '0');
      document.getElementById('minsNum').textContent = String(mins).padStart(2, '0');
      document.getElementById('secsNum').textContent = String(secs).padStart(2, '0');
    }
  }

  setInterval(updateTimer, 1000);
  updateTimer();
}

/* ==========================================================================
   7. INTERACTIVE ENVELOPE LOVE LETTER & GIFT REVEAL
   ========================================================================== */
const envelopeBtn = document.getElementById('envelopeBtn');
const letterCard = document.getElementById('letterCard');
const closeLetterBtn = document.getElementById('closeLetterBtn');

if (envelopeBtn && letterCard) {
  envelopeBtn.addEventListener('click', () => {
    envelopeBtn.style.display = 'none';
    letterCard.classList.remove('hidden');
  });
}

if (closeLetterBtn && letterCard && envelopeBtn) {
  closeLetterBtn.addEventListener('click', () => {
    letterCard.classList.add('hidden');
    envelopeBtn.style.display = 'flex';
  });
}

const giftBox = document.getElementById('giftBox');
const giftReveal = document.getElementById('giftReveal');
const celebrateBtn = document.getElementById('celebrateBtn');

if (giftBox && giftReveal) {
  giftBox.addEventListener('click', () => {
    giftBox.classList.add('open');
    setTimeout(() => {
      giftReveal.classList.remove('hidden');
      if (window.launchFireworks) window.launchFireworks();
    }, 400);
  });
}

if (celebrateBtn) {
  celebrateBtn.addEventListener('click', () => {
    if (window.launchFireworks) window.launchFireworks();
  });
}

/* ==========================================================================
   8. AUDIO PLAYER CONTROLS & CURSOR GLOW
   ========================================================================== */
const bgMusic = document.getElementById('bgMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const progressWrap = document.getElementById('progressWrap');
const volumeControl = document.getElementById('volumeControl');

function updatePlayPauseUI(isPlaying) {
  if (playPauseBtn) playPauseBtn.textContent = isPlaying ? '⏸️' : '🎵';
}

if (playPauseBtn && bgMusic) {
  playPauseBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      updatePlayPauseUI(true);
    } else {
      bgMusic.pause();
      updatePlayPauseUI(false);
    }
  });
}

if (bgMusic && progressBar) {
  bgMusic.addEventListener('timeupdate', () => {
    if (bgMusic.duration) {
      const pct = (bgMusic.currentTime / bgMusic.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });
}

if (progressWrap && bgMusic) {
  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    bgMusic.currentTime = (clickX / rect.width) * bgMusic.duration;
  });
}

if (volumeControl && bgMusic) {
  volumeControl.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
  });
}

const cursorGlow = document.getElementById('cursorGlow');
window.addEventListener('mousemove', (e) => {
  if (cursorGlow) {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top = `${e.clientY}px`;
  }
});
