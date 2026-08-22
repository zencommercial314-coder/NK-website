/* ============================================================
   EDIT ME — customize these before you ship it
============================================================ */
const TARGET_DATE = new Date('2026-07-23T00:00:00'); // birthday date/time
// Spotify link is already set on the <a id="spotify-link"> in index.html — edit it there.
// Letter text is in the #letter-text element in index.html — edit it there.

/* ============================================================
   PAGE NAVIGATION
============================================================ */
function goToPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

/* ============================================================
   COUNTDOWN
============================================================ */
const els = {
  days: document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  mins: document.getElementById('cd-mins'),
  secs: document.getElementById('cd-secs'),
};
const enterBtn = document.getElementById('enter-btn');
let unlocked = false;

function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    els.days.textContent = '00';
    els.hours.textContent = '00';
    els.mins.textContent = '00';
    els.secs.textContent = '00';
    if (!unlocked) {
      unlocked = true;
      enterBtn.disabled = false;
      enterBtn.textContent = "It's time 🎉 — Open your surprise";
    }
    return;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  els.days.textContent = pad(d);
  els.hours.textContent = pad(h);
  els.mins.textContent = pad(m);
  els.secs.textContent = pad(s);
}
updateCountdown();
setInterval(updateCountdown, 1000);

enterBtn.addEventListener('click', () => {
  if (!unlocked) return;
  goToPage('page-letter');
});

/* ============================================================
   LETTER -> CAKE
============================================================ */
document.getElementById('to-cake-btn').addEventListener('click', () => {
  goToPage('page-cake');
});

/* ============================================================
   CAKE INTERACTION: blow candle -> drag to cut cake -> surprise
============================================================ */
const cakeBtn = document.getElementById('cake-action-btn');
const flame = document.getElementById('flame');
const cake = document.getElementById('cake');
const sliceCut = document.getElementById('slice-cut');
const cakeTitle = document.getElementById('cake-title');
const cakeInstruction = document.getElementById('cake-instruction');
let cakeStage = 0; // 0 = candle lit, 1 = ready to cut (drag), 2 = cut done

const CUT_TOP = 36;       // matches .slice-cut top in CSS
const CUT_MAX_HEIGHT = 182; // matches .slice-cut.cut height in CSS
const CUT_THRESHOLD = 0.6;  // must drag at least 60% of the way down to count
let dragging = false;

cakeBtn.addEventListener('click', () => {
  if (cakeStage === 0) {
    flame.classList.add('out');
    cakeStage = 1;
    cakeTitle.textContent = 'Make a wish ✨';
    cakeInstruction.textContent = 'Now drag your finger across the cake to cut it';
    cakeBtn.style.display = 'none';
    cake.classList.add('cuttable');
  } else if (cakeStage === 2) {
    goToPage('page-surprise');
  }
});

function updateSliceCut(clientX, clientY) {
  const rect = cake.getBoundingClientRect();
  const x = Math.max(30, Math.min(rect.width - 30, clientX - rect.left));
  const y = Math.max(0, Math.min(CUT_MAX_HEIGHT, clientY - rect.top - CUT_TOP));
  sliceCut.style.left = `${x}px`;
  sliceCut.style.height = `${y}px`;
  return y / CUT_MAX_HEIGHT;
}

function finalizeCut(progress) {
  sliceCut.classList.remove('dragging');
  if (progress >= CUT_THRESHOLD) {
    sliceCut.classList.add('cut');
    sliceCut.style.height = `${CUT_MAX_HEIGHT}px`;
    cakeStage = 2;
    cake.classList.remove('cuttable');
    cakeInstruction.textContent = 'Sweet! One more thing waiting for you...';
    cakeBtn.style.display = 'inline-block';
    cakeBtn.textContent = 'Continue →';
  } else {
    sliceCut.style.height = '0px';
    cakeInstruction.textContent = 'Almost — drag all the way down to cut through';
  }
}

cake.addEventListener('pointerdown', (e) => {
  if (cakeStage !== 1) return;
  dragging = true;
  cake.setPointerCapture(e.pointerId);
  sliceCut.style.transition = 'none';
  sliceCut.classList.add('dragging');
  updateSliceCut(e.clientX, e.clientY);
});

cake.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  updateSliceCut(e.clientX, e.clientY);
});

function endDrag(e) {
  if (!dragging) return;
  dragging = false;
  const progress = updateSliceCut(e.clientX, e.clientY);
  sliceCut.style.transition = 'height 0.4s ease, left 0.4s ease';
  finalizeCut(progress);
}

cake.addEventListener('pointerup', endDrag);
cake.addEventListener('pointercancel', endDrag);

/* ============================================================
   PAGE 1 — TWINKLING STAR FIELD (2D canvas)
============================================================ */
const starsCanvas = document.getElementById('stars-canvas');
const sctx = starsCanvas.getContext('2d');
let stars = [];

function resizeStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
  const count = Math.floor((starsCanvas.width * starsCanvas.height) / 3200);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    r: Math.random() * Math.random() * 1.8 + 0.4, // weighted toward small stars
    baseAlpha: Math.random() * 0.5 + 0.3,
    twinkleSpeed: Math.random() * 0.03 + 0.01,
    phase: Math.random() * Math.PI * 2,
    warm: Math.random() < 0.3, // some stars glow gold instead of blue-white
  }));
}
window.addEventListener('resize', resizeStars);
resizeStars();

let t = 0;
let shootingStar = null;

function maybeSpawnShootingStar() {
  if (shootingStar || Math.random() > 0.006) return;
  const startX = Math.random() * starsCanvas.width * 0.6;
  const startY = Math.random() * starsCanvas.height * 0.3;
  shootingStar = {
    x: startX, y: startY,
    vx: 8 + Math.random() * 6,
    vy: 4 + Math.random() * 3,
    life: 0,
    maxLife: 40,
  };
}

function drawStars() {
  sctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

  stars.forEach(s => {
    const alpha = s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.35;
    const clamped = Math.max(0, Math.min(1, alpha));
    const color = s.warm ? `255, 226, 173` : `205, 225, 255`;

    // glow halo for bigger stars
    if (s.r > 1.1) {
      const glow = sctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
      glow.addColorStop(0, `rgba(${color}, ${clamped * 0.5})`);
      glow.addColorStop(1, `rgba(${color}, 0)`);
      sctx.fillStyle = glow;
      sctx.fillRect(s.x - s.r * 5, s.y - s.r * 5, s.r * 10, s.r * 10);
    }

    sctx.beginPath();
    sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    sctx.fillStyle = `rgba(${color}, ${clamped})`;
    sctx.fill();
  });

  maybeSpawnShootingStar();
  if (shootingStar) {
    const s = shootingStar;
    const progress = s.life / s.maxLife;
    const fade = 1 - progress;
    const tailX = s.x - s.vx * 6;
    const tailY = s.y - s.vy * 6;

    const grad = sctx.createLinearGradient(s.x, s.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255, 255, 255, ${fade})`);
    grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
    sctx.strokeStyle = grad;
    sctx.lineWidth = 2;
    sctx.beginPath();
    sctx.moveTo(s.x, s.y);
    sctx.lineTo(tailX, tailY);
    sctx.stroke();

    s.x += s.vx;
    s.y += s.vy;
    s.life++;
    if (s.life > s.maxLife || s.x > starsCanvas.width || s.y > starsCanvas.height) {
      shootingStar = null;
    }
  }

  t++;
  requestAnimationFrame(drawStars);
}
drawStars();

