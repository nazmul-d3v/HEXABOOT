/* ===================================================================
   HEXABOOT — Scroll-driven suit sequence & bespoke atelier interactions
   Canvas image-sequence scrubbing + editorial panel choreography
   =================================================================== */

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 535;
const framePath = (i) => `assets/frames/frame_${String(i).padStart(5, "0")}.webp`;

const canvas = document.getElementById("frames");
const ctx = canvas.getContext("2d", { alpha: false });

const images = new Array(FRAME_COUNT);
const state = { frame: 0 };
let dpr = Math.min(window.devicePixelRatio || 1, 2);

/* ---------- Canvas sizing + cover-fit draw ------------------------ */
function sizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  render();
}

function render() {
  const currentFrame = Math.min(Math.max(Math.round(state.frame), 0), FRAME_COUNT - 1);
  let img = images[currentFrame];

  // If current frame hasn't loaded yet, find nearest loaded frame to prevent black blink
  if (!img || !img.complete || !img.naturalWidth) {
    for (let offset = 1; offset < 30; offset++) {
      const prev = images[currentFrame - offset];
      if (prev && prev.complete && prev.naturalWidth) {
        img = prev;
        break;
      }
      const next = images[currentFrame + offset];
      if (next && next.complete && next.naturalWidth) {
        img = next;
        break;
      }
    }
  }

  if (!img || !img.complete || !img.naturalWidth) return;

  const cw = canvas.width, ch = canvas.height;
  const iw = img.naturalWidth, ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);   // cover
  const dw = iw * scale, dh = ih * scale;
  const dx = (cw - dw) * 0.5;
  const dy = (ch - dh) * 0.5;

  ctx.fillStyle = "#0a0a0b";
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---------- Preload ---------------------------------------------- */
const loaderEl = document.getElementById("loader");
const fillEl   = document.getElementById("loaderFill");
const pctEl    = document.getElementById("loaderPct");

function preload(onReady) {
  let loaded = 0;
  let started = false;

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = "async";
    img.onload = img.onerror = () => {
      loaded++;
      const p = loaded / FRAME_COUNT;
      const pct = Math.round(p * 100);
      if (fillEl) fillEl.style.width = pct + "%";
      if (pctEl) pctEl.textContent = pct;

      // First frame ready → paint immediately
      if (i === 0) render();

      // Start experience once we have enough buffer (e.g. 50 frames or all)
      if (!started && (loaded >= 50 || p === 1)) {
        started = true;
        onReady();
      }
      if (p === 1 && loaderEl) {
        loaderEl.classList.add("is-done");
      }
    };
    img.src = framePath(i + 1);
    images[i] = img;
  }

  // Safety fallback: dismiss loader after 4 seconds regardless
  setTimeout(() => {
    if (!started) {
      started = true;
      onReady();
    }
    if (loaderEl) loaderEl.classList.add("is-done");
  }, 4000);
}

/* ---------- Build scroll choreography ----------------------------- */
function build() {
  sizeCanvas();

  const progressFill = document.getElementById("progressFill");
  const heroPanel    = document.querySelector('[data-panel="hero"]');
  const panels       = gsap.utils.toArray(".panel:not(.panel--hero)");
  const navDots      = document.querySelectorAll(".scene-nav__dot");

  /* Editorial panel scroll milestones (0 -> 1) */
  const cues = [
    [0.115, 0.205], // 01 Foundation: shirt
    [0.235, 0.355], // 02 Waistcoat: vest + tie
    [0.385, 0.535], // 03 Canvas: jacket
    [0.560, 0.635], // 04 Cut: full suit
    [0.660, 0.765], // 05 Man: worn / cuff
    [0.790, 0.905], // 06 Procession: colour walk (The viral scene!)
    [0.925, 0.995]  // 07 Detail: macro cuff
  ];
  const FADE = 0.035;

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: "#scene",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      pin: "#sticky",
      pinSpacing: true,
      onUpdate: (self) => {
        const p = self.progress;
        if (progressFill) progressFill.style.width = (p * 100).toFixed(2) + "%";

        // Current movement derivation
        let activeIdx = 0;
        for (let i = 0; i < cues.length; i++) {
          if (p >= cues[i][0] - FADE) activeIdx = i + 1;
        }

        // Update dot indicators
        navDots.forEach((dot, idx) => {
          if (idx === activeIdx - 1) {
            dot.classList.add("is-active");
          } else {
            dot.classList.remove("is-active");
          }
        });
      }
    }
  });

  // 1 — the frame scrubber driving the canvas
  tl.to(state, {
    frame: FRAME_COUNT - 1,
    duration: 1,
    ease: "none",
    onUpdate: render
  }, 0);

  // Hero title dissolve
  if (heroPanel) {
    gsap.set(heroPanel, { autoAlpha: 1 });
    tl.to(heroPanel, { autoAlpha: 0, y: -30, duration: 0.03, ease: "power2.in" }, 0.004);
  }

  // Editorial panels fade in / out
  panels.forEach((panel, i) => {
    const [inAt, outAt] = cues[i];
    const fromX = panel.classList.contains("panel--right") ? 44 : -44;

    gsap.set(panel, { autoAlpha: 0, x: fromX, y: "-50%" });
    tl.to(panel, { autoAlpha: 1, x: 0, duration: FADE, ease: "power2.out" }, inAt);
    tl.to(panel, { autoAlpha: 0, x: -fromX * 0.5, duration: FADE, ease: "power2.in" }, outAt);
  });

  // Navigation dots click interaction
  navDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const targetMovement = parseInt(dot.getAttribute("data-target"), 10);
      const scene = document.getElementById("scene");
      if (!scene) return;
      const sceneTop = scene.offsetTop;
      const sceneHeight = scene.offsetHeight - window.innerHeight;
      const cue = cues[targetMovement - 1];
      if (cue) {
        const targetScroll = sceneTop + sceneHeight * ((cue[0] + cue[1]) / 2);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    });
  });

  ScrollTrigger.refresh();
}

/* ---------- Window resize ----------------------------------------- */
let resizeRAF;
window.addEventListener("resize", () => {
  cancelAnimationFrame(resizeRAF);
  resizeRAF = requestAnimationFrame(sizeCanvas);
});

/* ---------- Header hide on scroll-down ---------------------------- */
const header = document.getElementById("header");
let lastY = 0;
ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    const y = self.scroll();
    if (y > 120 && y > lastY) {
      if (header) header.style.transform = "translateY(-140%)";
    } else {
      if (header) header.style.transform = "translateY(0)";
    }
    lastY = y;
  }
});

/* ---------- Bespoke Fitting Modal --------------------------------- */
const modalBackdrop = document.getElementById("fittingModal");
const openModalBtns = document.querySelectorAll('[data-open-modal="fitting"]');
const closeModalBtn = document.getElementById("modalClose");
const fittingForm   = document.getElementById("fittingForm");

function openModal(e) {
  if (e) e.preventDefault();
  if (modalBackdrop) {
    modalBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  if (modalBackdrop) {
    modalBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }
}

openModalBtns.forEach((btn) => btn.addEventListener("click", openModal));
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

if (fittingForm) {
  fittingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = fittingForm.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = "Reservation Requested";
    btn.style.borderColor = "var(--gold)";
    btn.style.color = "var(--gold)";
    setTimeout(() => {
      alert("Thank you. A bespoke master tailor from HEXABOOT Mayfair will contact you within 24 hours to arrange your private fitting.");
      closeModal();
      btn.textContent = origText;
      fittingForm.reset();
    }, 400);
  });
}

/* ---------- Real Luxury Soundtrack Audio Player ------------------- */
const bgAudio          = document.getElementById("bgAudio");
const soundToggle      = document.getElementById("soundToggle");
const audioTrackSelect = document.getElementById("audioTrackSelect");

const audioTracks = {
  atelier: "assets/audio/atelier_luxury.mp3",
  clair:   "assets/audio/clair_de_lune.mp3",
  reel:    "assets/audio/reel_audio.m4a"
};

let isAudioPlaying = false;
let fadeInterval = null;

function fadeAudio(targetVolume, duration = 800, callback) {
  if (!bgAudio) return;
  clearInterval(fadeInterval);
  const stepTime = 40;
  const steps = duration / stepTime;
  const volDiff = targetVolume - bgAudio.volume;
  const volStep = volDiff / steps;

  fadeInterval = setInterval(() => {
    let nextVol = bgAudio.volume + volStep;
    if ((volStep > 0 && nextVol >= targetVolume) || (volStep < 0 && nextVol <= targetVolume)) {
      bgAudio.volume = Math.max(0, Math.min(1, targetVolume));
      clearInterval(fadeInterval);
      if (callback) callback();
    } else {
      bgAudio.volume = Math.max(0, Math.min(1, nextVol));
    }
  }, stepTime);
}

function playTrack(trackKey) {
  if (!bgAudio) return;
  const src = audioTracks[trackKey] || audioTracks.atelier;

  if (!bgAudio.src.endsWith(src)) {
    bgAudio.src = src;
    bgAudio.load();
  }

  bgAudio.volume = 0;
  bgAudio.play().then(() => {
    isAudioPlaying = true;
    fadeAudio(0.55, 1000);
    if (soundToggle) {
      soundToggle.classList.add("is-playing");
      const label = soundToggle.querySelector(".sound-label");
      if (label) label.textContent = "Music: On";
    }
  }).catch((err) => {
    console.warn("Audio playback waiting for user action:", err);
  });
}

function pauseTrack() {
  if (!bgAudio) return;
  fadeAudio(0, 600, () => {
    bgAudio.pause();
    isAudioPlaying = false;
    if (soundToggle) {
      soundToggle.classList.remove("is-playing");
      const label = soundToggle.querySelector(".sound-label");
      if (label) label.textContent = "Music: Off";
    }
  });
}

if (soundToggle) {
  soundToggle.addEventListener("click", () => {
    if (!isAudioPlaying) {
      const selected = audioTrackSelect ? audioTrackSelect.value : "atelier";
      playTrack(selected);
    } else {
      pauseTrack();
    }
  });
}

if (audioTrackSelect) {
  audioTrackSelect.addEventListener("change", (e) => {
    const chosenTrack = e.target.value;
    if (isAudioPlaying) {
      fadeAudio(0, 400, () => {
        playTrack(chosenTrack);
      });
    } else {
      const src = audioTracks[chosenTrack] || audioTracks.atelier;
      bgAudio.src = src;
    }
  });
}

/* ---------- Initialize -------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

preload(build);
