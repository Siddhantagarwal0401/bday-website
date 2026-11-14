/* ==========================================================================
   ✏️  EDIT ME — every word, photo and message on the site lives right here.
   Everything marked "placeholder" is sample text. Replace it with your own.
   ========================================================================== */

const MOM_NAME = "Mummy";

const CONFIG = {
  age: 49,

  // Hero + counter
  heroPhoto: "images/1.jpg",
  heroSubtitle: `To the world's best ${MOM_NAME}, I love you`,
  counterText: "years of love, kindness and being the heart of our home",

  // Section headings
  titles: {
    galleryEyebrow: "memories",
    gallery: "Moments with you",
    gallerySub: "Tap a photo to see it bigger, tap the heart to love it.",
    letterEyebrow: "written with all my heart",
    letter: "A letter, just for you",
    finaleEyebrow: "one last thing",
    finale: "There's a little surprise for you",
  },

  // Gallery: left empty, so the whole gallery section is hidden.
  // Got more photos later? e.g. gallery: ["images/4.jpg", "images/5.jpg", ...] and it comes back.
  gallery: [],
  galleryAlt: `A precious moment with ${MOM_NAME}`,

  // The letter (placeholder — this is the big one, pour your heart into it)
  letter: {
    greeting: `Dear ${MOM_NAME},`,
    paragraphs: [
      `Today you turn 49, and all I can think about is how lucky I am that out of everyone in the whole world, you are the one I get to call ${MOM_NAME}.`,
      "Thank you for the little things nobody else notices",
      "You taught me what kindness looks like, and what strength feels like. Everything good in me started with you.",
      `Happy Birthday :).`,
    ],
    signoff: "Forever yours,",
    from: "Sid",
    coverText: `For ${MOM_NAME}`,
  },

  // Finale
  finale: {
    button: "Open your surprise",
    photo: "images/2.jpg",             // falls back to images/1.jpg if missing
    text: `Happy Birthday ${MOM_NAME}, we love you more than words can say`,
  },

  music: "song.mp3",
};

/* ==========================================================================
   App code — you shouldn't need to touch anything below this line.
   ========================================================================== */
(() => {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "") => `<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const pick = (a) => a[Math.floor(Math.random() * a.length)];

  /* ---------- missing-image safety net ---------- */
  document.addEventListener("error", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLImageElement)) return;
    if (t.dataset.fallback) { const f = t.dataset.fallback; delete t.dataset.fallback; t.src = f; return; }
    if (t.parentElement) t.parentElement.classList.add("img-missing");
  }, true);
  $$("img").forEach((i) => { if (i.complete && i.src && !i.naturalWidth) i.dispatchEvent(new Event("error")); });

  /* ---------- fill static text from config ---------- */
  document.title = `Happy Birthday, ${MOM_NAME} 💗`;
  $$("[data-t]").forEach((el) => { const v = CONFIG.titles[el.dataset.t]; if (v) el.textContent = v; });
  $("#heroPhoto").src = CONFIG.heroPhoto;
  $("#heroPhoto").alt = `${MOM_NAME}, smiling`;
  $("#heroSub").textContent = CONFIG.heroSubtitle;
  $("#counterText").textContent = CONFIG.counterText;
  $("#coverTo").textContent = CONFIG.letter.coverText;
  $("#finalPhoto").src = CONFIG.finale.photo;
  $("#finaleText").textContent = CONFIG.finale.text;
  $("#surpriseBtn").textContent = CONFIG.finale.button;
  $("#count").setAttribute("aria-label", String(CONFIG.age));

  /* ---------- ornaments + corner decorations ---------- */
  $$(".orn").forEach((o) => { o.innerHTML = `${icon("i-heart", "o-h")}${icon("i-flower", "o-f")}${icon("i-heart", "o-h")}`; });
  const DECOR = { f: "i-flower", h: "i-heart", s: "i-sparkle" };
  $$("[data-decor]").forEach((sec) => {
    sec.dataset.decor.split(",").forEach((d, i) => {
      const [k, pos] = d.split("-");
      const s = document.createElement("span");
      s.className = `deco ${k} p-${pos}`;
      s.style.animationDelay = `${-i * 1.3}s`;
      s.setAttribute("aria-hidden", "true");
      s.innerHTML = icon(DECOR[k]);
      sec.prepend(s);
    });
  });

  /* ---------- hero: letter-by-letter reveal ---------- */
  function splitChars(el, text, start) {
    el.textContent = "";
    el.setAttribute("aria-label", text);
    [...text].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "char" + (ch === " " ? " space" : "");
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", start + i);
      s.textContent = ch === " " ? "\u00A0" : ch;
      el.appendChild(s);
    });
    return start + text.length;
  }
  const n1 = splitChars($("#heroLine1"), "Happy Birthday,", 0);
  splitChars($("#heroLine2"), MOM_NAME, n1 + 1);

  /* ---------- shapes shared by the canvases ---------- */
  const HEART = new Path2D("M23.6 0c-3.4 0-6.3 1.9-7.6 4.7C14.7 1.9 11.8 0 8.4 0 3.8 0 0 3.8 0 8.4c0 9.8 16 20.1 16 20.1s16-10.3 16-20.1C32 3.8 28.2 0 23.6 0z");
  const STAR  = new Path2D("M12 0C13 7 17 11 24 12 17 13 13 17 12 24 11 17 7 13 0 12 7 11 11 7 12 0z");
  const PETAL = new Path2D("M0 -8C6 -4 6 4 0 8C-6 4 -6 -4 0 -8z");
  function drawShape(c, kind, x, y, s, rot, color, alpha) {
    c.save();
    c.translate(x, y); c.rotate(rot); c.globalAlpha = alpha; c.fillStyle = color;
    if (kind === "heart")        { const k = s / 32; c.scale(k, k); c.translate(-16, -14.25); c.fill(HEART); }
    else if (kind === "sparkle") { const k = s / 24; c.scale(k, k); c.translate(-12, -12);    c.fill(STAR); }
    else                         { const k = s / 16; c.scale(k, k); c.fill(PETAL); }
    c.restore();
  }

  /* ---------- background canvas: floating hearts, petals, sparkles ---------- */
  const bg = $("#bg-fx"), bctx = bg.getContext("2d");
  const tr = $("#trail-fx"), tctx = tr.getContext("2d");
  let W = 0, H = 0, dpr = 1, particles = [], bgRaf = 0, lastT = 0;
  const PALETTE = {
    heart:   ["#FF5C8A", "#FF8FB0", "#C85C7B", "#FFB3C8"],
    petal:   ["#FFB3C8", "#FFC9D9", "#FF8FB0", "#FFD6E2"],
    sparkle: ["#F2C14E", "#FFE08A", "#FFFFFF"],
  };

  function sizeCanvases() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    [bg, tr].forEach((c) => { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); });
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makeParticle(initial) {
    const r = Math.random();
    const kind = r < 0.45 ? "heart" : r < 0.78 ? "petal" : "sparkle";
    const falling = kind === "petal";
    const s = kind === "heart" ? 10 + Math.random() * 16 : kind === "petal" ? 9 + Math.random() * 10 : 6 + Math.random() * 9;
    return {
      kind, s, x: Math.random() * W,
      y: initial ? Math.random() * H : (falling ? -20 : H + 24),
      vy: falling ? 0.35 + Math.random() * 0.7 : -(0.25 + Math.random() * 0.6),
      sway: Math.random() * 6.28, swaySpd: 0.01 + Math.random() * 0.015, amp: 10 + Math.random() * 26,
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.025,
      a: 0.28 + Math.random() * 0.45, c: pick(PALETTE[kind]), tw: Math.random() * 6.28,
    };
  }

  function seedParticles() {
    const count = Math.round(Math.min(40, Math.max(16, W / 22)));
    particles = Array.from({ length: count }, () => makeParticle(true));
  }

  function drawBg(k) {
    bctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      if (k) {
        p.sway += p.swaySpd * k; p.y += p.vy * k; p.rot += p.vr * k; p.tw += 0.06 * k;
        if (p.y < -40 || p.y > H + 40) Object.assign(p, makeParticle(false));
      }
      const x = p.x + Math.sin(p.sway) * p.amp;
      const alpha = p.kind === "sparkle" ? p.a * (0.6 + 0.4 * Math.sin(p.tw)) : p.a;
      drawShape(bctx, p.kind, x, p.y, p.s, p.kind === "heart" ? p.rot * 0.12 : p.rot, p.c, alpha);
    }
  }

  function bgLoop(t) {
    const k = Math.min((t - lastT) / 16.67, 3) || 1;
    lastT = t;
    drawBg(k);
    bgRaf = requestAnimationFrame(bgLoop);
  }
  function startBg() { cancelAnimationFrame(bgRaf); lastT = performance.now(); bgRaf = requestAnimationFrame(bgLoop); }

  sizeCanvases(); seedParticles();
  if (reduce) drawBg(0); else startBg();
  document.addEventListener("visibilitychange", () => {
    if (reduce) return;
    if (document.hidden) cancelAnimationFrame(bgRaf); else startBg();
  });
  let rsT;
  window.addEventListener("resize", () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => {
      // ignore small height changes (mobile address bar collapsing)
      if (window.innerWidth === W && Math.abs(window.innerHeight - H) < 150) return;
      sizeCanvases(); seedParticles(); if (reduce) drawBg(0);
    }, 150);
  });

  /* ---------- cursor / touch trail + tap bursts ---------- */
  let trail = [], trailRunning = false, lastSpawn = 0;
  const TRAIL_COLORS = ["#FF5C8A", "#FF8FB0", "#FFB3C8", "#C85C7B"];

  function trailTick() {
    tctx.clearRect(0, 0, W, H);
    for (const p of trail) {
      p.x += p.vx; p.y += p.vy; p.vy += p.g; p.life -= p.decay; p.rot += p.vr;
      if (p.life > 0) drawShape(tctx, p.kind, p.x, p.y, p.s * (0.5 + p.life * 0.5), p.rot, p.c, Math.max(p.life, 0));
    }
    trail = trail.filter((p) => p.life > 0);
    if (trail.length) requestAnimationFrame(trailTick); else { trailRunning = false; tctx.clearRect(0, 0, W, H); }
  }
  function kickTrail() { if (!trailRunning) { trailRunning = true; requestAnimationFrame(trailTick); } }

  function spawnTrail(x, y) {
    if (reduce) return;
    const now = performance.now();
    if (now - lastSpawn < 30) return;
    lastSpawn = now;
    const n = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < n; i++) {
      const sparkle = Math.random() < 0.4;
      trail.push({
        kind: sparkle ? "sparkle" : "heart", c: sparkle ? pick(PALETTE.sparkle) : pick(TRAIL_COLORS),
        x: x + (Math.random() - 0.5) * 10, y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 1.2, vy: -0.4 - Math.random() * 0.9, g: 0.012,
        life: 1, decay: 0.018 + Math.random() * 0.02, s: 7 + Math.random() * 9, rot: (Math.random() - 0.5) * 0.8, vr: (Math.random() - 0.5) * 0.05,
      });
    }
    if (trail.length > 80) trail.splice(0, trail.length - 80);
    kickTrail();
  }
  function burstAt(x, y, n = 12) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 3;
      const sparkle = i % 3 === 0;
      trail.push({
        kind: sparkle ? "sparkle" : "heart", c: sparkle ? pick(PALETTE.sparkle) : pick(TRAIL_COLORS),
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, g: 0.06,
        life: 1, decay: 0.014 + Math.random() * 0.012, s: 9 + Math.random() * 11, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.12,
      });
    }
    kickTrail();
  }
  window.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") spawnTrail(e.clientX, e.clientY); }, { passive: true });
  const onTouch = (e) => { const t = e.touches[0]; if (t) spawnTrail(t.clientX, t.clientY); };
  window.addEventListener("touchstart", onTouch, { passive: true });
  window.addEventListener("touchmove", onTouch, { passive: true });

  /* ---------- hero parallax ---------- */
  const parallaxEls = $$(".parallax");
  let pTicking = false;
  if (!reduce) {
    window.addEventListener("scroll", () => {
      if (pTicking) return;
      pTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight * 1.4) parallaxEls.forEach((el) => el.style.setProperty("--py", (y * parseFloat(el.dataset.speed)).toFixed(1) + "px"));
        pTicking = false;
      });
    }, { passive: true });
  }

  /* ---------- gallery ---------- */
  const gal = $("#gallery");
  gal.innerHTML = CONFIG.gallery.map((src, i) => `
    <figure class="shot">
      <button class="shot-open" data-i="${i}" aria-label="Open photo ${i + 1}">
        <img src="${esc(src)}" alt="${esc(CONFIG.galleryAlt)} (${i + 1})" loading="lazy" decoding="async">
      </button>
      <button class="like" aria-label="Love this photo" aria-pressed="false">${icon("i-heart")}</button>
    </figure>`).join("");

  function popHearts(btn) {
    btn.classList.remove("pop"); void btn.offsetWidth; btn.classList.add("pop");
    for (let i = 0; i < 7; i++) {
      const h = document.createElement("span");
      h.innerHTML = icon("i-heart", "mini-heart");
      const m = h.firstChild;
      m.style.setProperty("--dx", `${(Math.random() - 0.5) * 90}px`);
      m.style.setProperty("--dy", `${-30 - Math.random() * 70}px`);
      btn.appendChild(m);
      setTimeout(() => m.remove(), 950);
    }
    const r = btn.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, 8);
  }

  if (!CONFIG.gallery.length) $("#gallery-sec").hidden = true;

  gal.addEventListener("click", (e) => {
    const like = e.target.closest(".like");
    if (like) {
      const on = like.classList.toggle("liked");
      like.setAttribute("aria-pressed", String(on));
      if (on) popHearts(like);
      return;
    }
    const open = e.target.closest(".shot-open");
    if (open) openLightbox(Number(open.dataset.i));
  });

  /* ---------- lightbox ---------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCount = $("#lbCount");
  let lbIdx = 0, lbFocus = null;
  function showPhoto(i, animate = true) {
    const n = CONFIG.gallery.length;
    lbIdx = (i + n) % n;
    const apply = () => {
      lbImg.src = CONFIG.gallery[lbIdx];
      lbImg.alt = `${CONFIG.galleryAlt} (${lbIdx + 1})`;
      lbCount.textContent = `${lbIdx + 1} / ${n}`;
      lbImg.classList.remove("swap");
    };
    if (animate && !reduce) { lbImg.classList.add("swap"); setTimeout(apply, 180); } else apply();
    [1, -1].forEach((d) => { const im = new Image(); im.src = CONFIG.gallery[(lbIdx + d + n) % n]; });
  }
  function openLightbox(i) {
    lbFocus = document.activeElement;
    lb.hidden = false; document.body.classList.add("noscroll");
    showPhoto(i, false); $("#lbClose").focus();
  }
  function closeLightbox() {
    lb.hidden = true; document.body.classList.remove("noscroll");
    if (lbFocus && lbFocus.focus) lbFocus.focus();
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => showPhoto(lbIdx - 1));
  $("#lbNext").addEventListener("click", () => showPhoto(lbIdx + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowLeft") showPhoto(lbIdx - 1);
    else if (e.key === "ArrowRight") showPhoto(lbIdx + 1);
  });
  let tx = 0, ty = 0;
  lb.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showPhoto(lbIdx + (dx < 0 ? 1 : -1));
    else if (Math.abs(dy) > 90 && Math.abs(dy) > Math.abs(dx)) closeLightbox();
  }, { passive: true });

  /* ---------- letter: wax seal + typewriter ---------- */
  const paper = $("#paper"), seal = $("#seal"), cover = $("#cover");
  let letterOpened = false, skipTyping = false;

  async function typeInto(el, text) {
    el.classList.add("caret");
    for (let i = 1; i <= text.length; i++) {
      el.firstChild ? (el.firstChild.nodeValue = text.slice(0, i)) : el.append(text.slice(0, i));
      if (skipTyping) { el.firstChild.nodeValue = text; break; }
      const ch = text[i - 1];
      await sleep(/[.!?]/.test(ch) ? 260 : /[,;:]/.test(ch) ? 140 : 24);
    }
    el.classList.remove("caret");
  }

  async function typewriteLetter() {
    const L = CONFIG.letter;
    const greet = $("#letterGreet"), body = $("#letterBody"), sign = $("#letterSign"), from = $("#letterFrom");
    body.textContent = ""; greet.textContent = ""; sign.textContent = ""; from.textContent = "";
    const items = [[greet, L.greeting]];
    L.paragraphs.forEach((p) => { const el = document.createElement("p"); body.appendChild(el); items.push([el, p]); });
    items.push([sign, L.signoff], [from, L.from]);
    if (reduce) { items.forEach(([el, t]) => { el.textContent = t; }); return; }
    for (const [el, t] of items) { await typeInto(el, t); await sleep(skipTyping ? 0 : 260); }
  }

  async function openLetter() {
    if (letterOpened) return;
    letterOpened = true;
    seal.disabled = true;
    const r = seal.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, 16);
    paper.classList.add("open");
    await sleep(reduce ? 0 : 1100);
    cover.hidden = true;
    typewriteLetter();
  }
  seal.addEventListener("click", openLetter);
  $("#paperBody").addEventListener("click", () => { skipTyping = true; });   // tap the letter to skip the typing

  /* ---------- finale ---------- */
  const heartShape = (() => {
    try {
      return typeof confetti === "function" && confetti.shapeFromPath
        ? confetti.shapeFromPath({ path: "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z" })
        : null;
    } catch (_) { return null; }
  })();

  function fireConfetti() {
    if (typeof confetti !== "function" || reduce) return;
    const colors = ["#FF5C8A", "#FF8FB0", "#FFB3C8", "#C85C7B", "#F2C14E", "#FFFFFF"];
    const shapes = heartShape ? [heartShape, heartShape, "circle", "square"] : ["circle", "square"];
    const base = { colors, shapes, scalar: heartShape ? 2.4 : 1.1, zIndex: 95, disableForReducedMotion: true, ticks: 220 };
    confetti({ ...base, particleCount: 160, spread: 110, startVelocity: 55, origin: { x: 0.5, y: 0.62 } });
    setTimeout(() => confetti({ ...base, particleCount: 90, angle: 60,  spread: 70, startVelocity: 60, origin: { x: 0, y: 0.75 } }), 350);
    setTimeout(() => confetti({ ...base, particleCount: 90, angle: 120, spread: 70, startVelocity: 60, origin: { x: 1, y: 0.75 } }), 350);
    const end = performance.now() + 2400;
    (function rain() {
      confetti({ ...base, particleCount: 3, angle: 90, spread: 160, startVelocity: 18, gravity: 0.7, origin: { x: Math.random(), y: -0.05 } });
      if (performance.now() < end) requestAnimationFrame(rain);
    })();
  }

  $("#surpriseBtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.classList.add("gone");
    $("#megaHeart").classList.add("go");
    fireConfetti();
    await sleep(reduce ? 0 : 1100);
    const reveal = $("#finaleReveal");
    reveal.hidden = false;
    void reveal.offsetWidth;
    reveal.classList.add("show");
    $(".surprise-wrap").classList.add("done");
    reveal.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    setTimeout(() => $("#megaHeart").classList.remove("go"), 2500);
  });

  /* ---------- music (plays only on tap) ---------- */
  const audio = $("#song"), mbtn = $("#music"), toastEl = $("#toast");
  audio.src = CONFIG.music;
  let toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("show"), 3400);
  }
  function setPlaying(on) {
    mbtn.classList.toggle("playing", on);
    mbtn.setAttribute("aria-pressed", String(on));
    mbtn.setAttribute("aria-label", on ? "Pause music" : "Play music");
  }
  mbtn.addEventListener("click", async () => {
    if (!audio.paused) { audio.pause(); setPlaying(false); return; }
    try { await audio.play(); setPlaying(true); }
    catch (_) { setPlaying(false); toast(`Couldn't play. Add your song as "${CONFIG.music}" next to index.html 🎵`); }
  });
  audio.addEventListener("pause", () => setPlaying(false));
  audio.addEventListener("play", () => setPlaying(true));

  /* ---------- scroll reveal + counter ---------- */
  function runCounter() {
    const el = $("#count"), target = CONFIG.age;
    if (reduce) { el.textContent = target; return; }
    const dur = 2300, t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target);
      if (p < 1) requestAnimationFrame(tick);
      else { const r = el.getBoundingClientRect(); burstAt(r.left + r.width / 2, r.top + r.height / 2, 14); }
    };
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      if (en.target.classList.contains("count-card")) setTimeout(runCounter, 250);
      io.unobserve(en.target);
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));
})();
