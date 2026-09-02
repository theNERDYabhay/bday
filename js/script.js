/* ============================================================
   EDIT ME — personalise the site here
   ============================================================ */
const CONFIG = {
  cakeHeading: "Make a wish & blow out the candles",
  collageTitle: "Every little moment with you",
  finalNote: "Here's to more birthdays, more cake, and more us. I love you. 💛",
  candleCount: 5,
  blowSensitivity: 0.09,

  flowers: [
    "media/flower1.jpeg","media/flower2.jpeg","media/flower3.jpeg","media/flower4.jpeg",
    "media/flower5.jpeg","media/flower6.jpeg","media/flower7.jpeg","media/flower8.jpeg",
  ],
  videos: [
    "media/vid1.mp4","media/vid2.mp4","media/vid3.mp4",
    "media/vid4.mp4","media/vid5.mp4","media/vid6.mp4",
  ],

  letterMessage: "Every year with you feels like the best one yet. Thank you for being the softest place I know, the loudest laugh in every room, and my favourite person to grow beside. Happy birthday, my love — here's to this beautiful life we're building, one silly, sweet, ordinary day at a time.",

  // Put your own photos in the /photos folder and list filenames here.
  photos: [
    "photos/1.jpg","photos/2.jpg","photos/3.jpg","photos/4.jpg","photos/5.jpg",
  ],
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function goToScene(id){
  $$('.scene').forEach(s => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

/* ============================================================
   TINY SOUND FX ENGINE (synthesised — no extra files needed)
   ============================================================ */
const SFX = (() => {
  let ctx = null;
  function ac(){
    if (!ctx){
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function noiseBurst(t, dur, gainPeak, freq){
    const c = ac();
    const bufferSize = Math.floor(c.sampleRate * dur);
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1);

    const src = c.createBufferSource();
    src.buffer = buffer;

    const bp = c.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = 0.9;

    const g = c.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainPeak, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);

    src.connect(bp);
    bp.connect(g);
    g.connect(c.destination);
    src.start(t);
    src.stop(t + dur);
  }
  return {
    /* a little cluster of clap-like noise bursts = crowd applause */
    applause(){
      const c = ac();
      const now = c.currentTime;
      const claps = 26;
      for (let i = 0; i < claps; i++){
        const t = now + Math.random() * 1.4;
        noiseBurst(t, 0.07 + Math.random() * 0.05, 0.35 + Math.random() * 0.25, 1800 + Math.random() * 2200);
      }
    },
    chime(){
      const c = ac();
      const now = c.currentTime;
      [880, 1108, 1318].forEach((f, i) => {
        const g = c.createGain();
        g.gain.setValueAtTime(0, now + i * 0.09);
        g.gain.linearRampToValueAtTime(0.18, now + i * 0.09 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.5);
        const o = c.createOscillator();
        o.type = 'sine'; o.frequency.value = f;
        o.connect(g); g.connect(c.destination);
        o.start(now + i * 0.09); o.stop(now + i * 0.09 + 0.5);
      });
    }
  };
})();

/* ============================================================
   CELEBRATION FX (confetti sparks + pop text)
   ============================================================ */
function celebrate(text){
  const layer = $('#celebrateLayer');
  const colors = ['#e6c288','#e3a6a0','#f6ead8','#c9973f','#ffffff'];
  for (let i = 0; i < 34; i++){
    const s = document.createElement('div');
    s.className = 'spark';
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 140;
    s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    s.style.background = colors[i % colors.length];
    s.style.left = (40 + Math.random() * 20) + '%';
    s.style.top = (30 + Math.random() * 20) + '%';
    layer.appendChild(s);
    requestAnimationFrame(() => s.classList.add('go'));
    setTimeout(() => s.remove(), 1000);
  }
  if (text){
    const p = document.createElement('div');
    p.className = 'pop-text';
    p.textContent = text;
    layer.appendChild(p);
    requestAnimationFrame(() => p.classList.add('go'));
    setTimeout(() => p.remove(), 1100);
  }
  SFX.applause();
}

/* ============================================================
   SCENE 1 — ENTRANCE
   ============================================================ */
$('#enterBtn').addEventListener('click', () => {
  goToScene('flowerBurst');
  runFlowerBurst();
});

/* ============================================================
   SCENE 2 — FLOWER BURST (fills the screen with the collage)
   ============================================================ */
function runFlowerBurst(){
  const grid = $('#flowerGrid');
  grid.innerHTML = '';
  CONFIG.flowers.forEach((src, i) => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.style.animationDelay = (i * 0.06) + 's';
    grid.appendChild(img);
  });
  setTimeout(() => {
    goToScene('introScene');
    startIntroVideo();
  }, 2100);
}

/* ============================================================
   SCENE 3 — RANDOM INTRO VIDEO
   ============================================================ */
let introStarted = false;

function startIntroVideo(){
  if (introStarted) return;
  introStarted = true;

  const vid = $('#introVideo');
  const pick = CONFIG.videos[Math.floor(Math.random() * CONFIG.videos.length)];
  vid.src = pick;
  vid.muted = false;
  vid.volume = 1;
  vid.currentTime = 0;
  vid.play().catch(() => {});

  vid.addEventListener('ended', finishIntro, { once:true });
  setTimeout(() => { if (introStarted && !introFinished) finishIntro(); }, 26000);
  $('#skipIntro').addEventListener('click', finishIntro, { once:true });
}

let introFinished = false;
function finishIntro(){
  if (introFinished) return;
  introFinished = true;
  $('#introVideo').pause();
  enterCakeScene();
}

/* ============================================================
   SCENE 4 — CAKE: candles, mic-based blowing, cursor-cut
   ============================================================ */
let cakeEntered = false;
let candlesLit = 0;
let micStream = null;
let audioCtx = null;

function enterCakeScene(){
  if (cakeEntered) { goToScene('cakeScene'); return; }
  cakeEntered = true;

  $('#cakeHeading').textContent = CONFIG.cakeHeading;
  buildCandles();
  goToScene('cakeScene');
  attachClickToBlowFallback();
  attachKnifeCut();

  $('#micBtn').addEventListener('click', requestMic);
  requestMic(true);

  startBGM();
  $('#soundBtn').classList.add('show');
}

function buildCandles(){
  const wrap = $('#candles');
  wrap.innerHTML = '';
  candlesLit = CONFIG.candleCount;
  for (let i = 0; i < CONFIG.candleCount; i++){
    const c = document.createElement('div');
    c.className = 'candle';
    c.dataset.index = i;
    c.innerHTML = `<div class="wick"></div><div class="flame"></div><div class="smoke"></div>`;
    wrap.appendChild(c);
  }
}

function attachClickToBlowFallback(){
  $('#candles').addEventListener('click', (e) => {
    const candle = e.target.closest('.candle');
    if (candle && !candle.classList.contains('out')) extinguish(candle);
  });
}

function extinguish(candleEl){
  if (candleEl.classList.contains('out')) return;
  candleEl.classList.add('out');
  candlesLit--;
  if (candlesLit <= 0) onAllCandlesOut();
}

function extinguishNext(){
  const lit = $$('.candle:not(.out)');
  if (lit.length) extinguish(lit[0]);
}

function onAllCandlesOut(){
  stopMic();
  $('#micBtn').classList.add('hidden');
  $('#cakeSub').textContent = "Perfect! Now slice the cake.";
  $('#cutHint').classList.add('show');
  celebrate('Yay! 🎉');
}

/* ---- microphone "blow" detection ---- */
function requestMic(silent){
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    if (!silent) $('#cakeSub').textContent = "This browser can't access the mic — tap a candle instead.";
    return;
  }
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      micStream = stream;
      $('#micBtn').classList.add('hidden');
      startListening(stream);
    })
    .catch(() => {
      if (!silent) $('#cakeSub').textContent = "Mic denied — no worries, tap a candle to blow it out.";
    });
}

function startListening(stream){
  const AC = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AC();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 1024;
  source.connect(analyser);

  const data = new Uint8Array(analyser.fftSize);
  let cooldown = false;

  (function poll(){
    if (!micStream) return;
    analyser.getByteTimeDomainData(data);
    let sumSquares = 0;
    for (let i = 0; i < data.length; i++){
      const v = (data[i] - 128) / 128;
      sumSquares += v * v;
    }
    const rms = Math.sqrt(sumSquares / data.length);

    if (rms > CONFIG.blowSensitivity && !cooldown){
      cooldown = true;
      extinguishNext();
      setTimeout(() => { cooldown = false; }, 550);
    }
    requestAnimationFrame(poll);
  })();
}

function stopMic(){
  if (micStream){ micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (audioCtx){ audioCtx.close(); audioCtx = null; }
}

/* ---- cursor / finger cut gesture ---- */
function attachKnifeCut(){
  const stage = $('#cakeStage');
  const cake = $('#cake');
  const trail = $('#knifeTrail');
  let dragging = false;
  let startX = null;
  let sliced = false;

  function within(x, y){
    const r = cake.getBoundingClientRect();
    return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10;
  }
  function trailAt(x){
    const r = cake.getBoundingClientRect();
    const rel = Math.max(0, Math.min(r.width, x - r.left));
    trail.style.left = rel + 'px';
    trail.classList.add('show');
  }
  function down(x, y){
    if (candlesLit > 0 || sliced) return;
    if (!within(x, y)) return;
    dragging = true; startX = x; trailAt(x);
  }
  function move(x, y){
    if (!dragging || sliced) return;
    trailAt(x);
    const r = cake.getBoundingClientRect();
    if (Math.abs(x - startX) > r.width * 0.5){
      sliced = true;
      trail.classList.remove('show');
      cake.classList.add('slicing');
      setTimeout(() => {
        cake.classList.remove('slicing');
        cake.classList.add('cut');
        cake.classList.add('locked');
        celebrate('Sweet! 🍰');
        setTimeout(enterLetterScene, 1000);
      }, 460);
    }
  }
  function up(){ dragging = false; trail.classList.remove('show'); }

  stage.addEventListener('mousedown', (e) => down(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', up);
  stage.addEventListener('touchstart', (e) => { const t = e.touches[0]; down(t.clientX, t.clientY); }, { passive:true });
  stage.addEventListener('touchmove', (e) => { const t = e.touches[0]; move(t.clientX, t.clientY); }, { passive:true });
  stage.addEventListener('touchend', up);
}

/* ============================================================
   SCENE 5 — SWIPE-AWAY FLOWERS -> LOVE LETTER
   ============================================================ */
let letterEntered = false;
let cardsRemaining = 0;

const CARD_LAYOUT = [
  { top:'6%',  left:'4%',  rot:-9  },
  { top:'8%',  left:'54%', rot:7   },
  { top:'34%', left:'-2%', rot:5   },
  { top:'36%', left:'56%', rot:-6  },
  { top:'62%', left:'2%',  rot:-4  },
  { top:'64%', left:'52%', rot:8   },
];

function enterLetterScene(){
  if (letterEntered) { goToScene('letterScene'); return; }
  letterEntered = true;
  buildSwipeFlowers();
  goToScene('letterScene');
  attachEnvelopeTap();
}

function buildSwipeFlowers(){
  const wrap = $('#swipeFlowers');
  wrap.innerHTML = '';
  const pics = CONFIG.flowers.slice(2, 2 + CARD_LAYOUT.length); // a fresh-feeling subset
  cardsRemaining = pics.length;

  pics.forEach((src, i) => {
    const pos = CARD_LAYOUT[i % CARD_LAYOUT.length];
    const card = document.createElement('div');
    card.className = 'swipe-card';
    card.style.top = pos.top;
    card.style.left = pos.left;
    card.style.setProperty('--rot', pos.rot + 'deg');
    card.style.transform = `rotate(${pos.rot}deg)`;
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    card.appendChild(img);
    wrap.appendChild(card);
    attachSwipe(card, pos.rot);
  });
}

function attachSwipe(card, baseRot){
  let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;

  function pointerDown(e){
    dragging = true;
    card.classList.add('dragging');
    const p = e.touches ? e.touches[0] : e;
    startX = p.clientX; startY = p.clientY;
    card.setPointerCapture && e.pointerId != null && card.setPointerCapture(e.pointerId);
  }
  function pointerMove(e){
    if (!dragging) return;
    const p = e.touches ? e.touches[0] : e;
    dx = p.clientX - startX;
    dy = p.clientY - startY;
    card.style.transform = `translate(${dx}px, ${dy}px) rotate(${baseRot + dx * 0.06}deg)`;
  }
  function pointerUp(){
    if (!dragging) return;
    dragging = false;
    card.classList.remove('dragging');
    const threshold = 90;
    if (Math.abs(dx) > threshold){
      const flyX = dx > 0 ? window.innerWidth : -window.innerWidth;
      card.style.transform = `translate(${flyX}px, ${dy + dx * 0.3}px) rotate(${baseRot + (dx > 0 ? 50 : -50)}deg)`;
      card.classList.add('gone');
      cardsRemaining--;
      if (cardsRemaining <= 0) revealEnvelopePrompt();
    } else {
      card.style.transform = `translate(0,0) rotate(${baseRot}deg)`;
    }
    dx = 0; dy = 0;
  }

  card.addEventListener('mousedown', pointerDown);
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('mouseup', pointerUp);
  card.addEventListener('touchstart', pointerDown, { passive:true });
  card.addEventListener('touchmove', pointerMove, { passive:true });
  card.addEventListener('touchend', pointerUp);
}

function revealEnvelopePrompt(){
  $('#letterHint').style.opacity = '0';
  $('#tapEnvelope').textContent = 'tap the letter';
}

function attachEnvelopeTap(){
  $('#envelope').addEventListener('click', () => {
    if (cardsRemaining > 0) return; // must clear the flowers first
    const env = $('#envelope');
    if (env.classList.contains('open')) return;
    env.classList.add('open');
    $('#envelopeWrap').classList.add('opened');
    SFX.chime();
    setTimeout(revealLetterWords, 500);
  });
}

function revealLetterWords(){
  const el = $('#paperWords');
  el.innerHTML = '';
  const words = CONFIG.letterMessage.split(' ');
  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'w';
    span.textContent = word + ' ';
    span.style.animationDelay = (i * 0.11) + 's';
    el.appendChild(span);
  });
  const totalTime = words.length * 110 + 700;
  setTimeout(() => { $('#toCarouselBtn').classList.remove('hidden'); }, totalTime);
}

$('#toCarouselBtn').addEventListener('click', enterCollageScene);

/* ============================================================
   SCENE 6 — FAN CAROUSEL (revolves every 3s)
   ============================================================ */
let collageEntered = false;
let currentSlide = 0;
let carouselTimer = null;
let cardEls = [];

function enterCollageScene(){
  if (collageEntered) { goToScene('collageScene'); return; }
  collageEntered = true;

  $('#collageTitle').textContent = CONFIG.collageTitle;
  $('#finalNote').textContent = CONFIG.finalNote;
  buildFanCarousel();
  goToScene('collageScene');
}

function placeholderDataURI(index){
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="%233a2419"/><stop offset="1" stop-color="%231c130f"/>
    </linearGradient></defs>
    <rect width="400" height="500" fill="url(%23g)"/>
    <text x="50%" y="46%" font-family="sans-serif" font-size="20" fill="%23e6c288" text-anchor="middle">Add photo ${index + 1}</text>
    <text x="50%" y="54%" font-family="sans-serif" font-size="13" fill="%23f6ead8" text-anchor="middle">photos/${index + 1}.jpg</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function buildFanCarousel(){
  const wrap = $('#fanCarousel');
  wrap.innerHTML = '';
  cardEls = CONFIG.photos.map((src, i) => {
    const card = document.createElement('div');
    card.className = 'fan-card pos-hidden';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `memory ${i + 1}`;
    img.onerror = () => { img.onerror = null; img.src = placeholderDataURI(i); };
    card.appendChild(img);
    wrap.appendChild(card);
    return card;
  });
  layoutFan();
  startFanAutoplay();
}

function layoutFan(){
  const n = cardEls.length;
  cardEls.forEach((card, i) => {
    let offset = (i - currentSlide) % n;
    if (offset > n / 2) offset -= n;
    if (offset < -n / 2) offset += n;

    let cls = 'pos-hidden';
    if (offset === 0) cls = 'pos-center';
    else if (offset === -1) cls = 'pos-left1';
    else if (offset === 1) cls = 'pos-right1';
    else if (offset === -2) cls = 'pos-left2';
    else if (offset === 2) cls = 'pos-right2';

    card.className = 'fan-card ' + cls;
  });
}

function startFanAutoplay(){
  clearInterval(carouselTimer);
  carouselTimer = setInterval(() => {
    currentSlide = (currentSlide + 1) % cardEls.length;
    layoutFan();
  }, 3000);
}

/* ============================================================
   BGM
   ============================================================ */
function startBGM(){
  const audio = $('#bgmAudio');
  audio.volume = 0.5;
  audio.play().catch(() => {});
}

$('#soundBtn').addEventListener('click', () => {
  const audio = $('#bgmAudio');
  audio.muted = !audio.muted;
  $('#soundBtn').textContent = audio.muted ? '🔇' : '🔊';
  if (!audio.muted && audio.paused) audio.play().catch(() => {});
});
