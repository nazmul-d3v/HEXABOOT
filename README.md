# HEXABOOT — The Anatomy of a Suit 🧵✨

> An ultra-luxury, 3D scroll-driven bespoke tailoring digital experience inspired by Savile Row craftsmanship and high-fashion ateliers.

**Crafted by [Nazmul](https://github.com/hello-nazzmul)**

---

## 🌟 Overview

**HEXABOOT** is an immersive, cinematic web application that chronicles the artisanal creation of a bespoke three-piece suit through **seven continuous movements of craft**. Utilizing canvas image-sequence scrubbing synchronized with GreenSock's `ScrollTrigger`, the experience renders seamless, photorealistic motion at 60 FPS without heavy WebGL 3D model overhead.

---

## 🎬 Narrative Movements

1. **Movement 00 — The Particle Form**: *Bespoke Since MCMXC8* — Dynamic title dissolve and cinematic vignette.
2. **Movement 01 — The Foundation**: *A Shirt of Pure Cotton* — Egyptian Two-Ply Poplin · 120s single needle seam.
3. **Movement 02 — The Waistcoat**: *Structure, Held Close* — Mulberry silk woven in Como, cut on the bias.
4. **Movement 03 — The Canvas**: *Built on Full Canvas* — Hand-padded horsehair chest canvas.
5. **Movement 04 — The Cut**: *The Complete Silhouette* — Super 150's Merino (240g) draped over roped shoulders.
6. **Movement 05 — The Man**: *Made to Be Worn* — Individually made to measure tailoring in motion.
7. **Movement 06 — The Procession**: *A Language of Colour* — Four signature tones (charcoal, ecru, oyster grey, deep burgundy flannel) advancing through midnight streetlamps.
8. **Movement 07 — The Detail**: *The Last Quarter-Inch* — Functioning surgeon's cuffs, horn buttons, and pick-stitching.

---

## ✨ Features

- **535-Frame 60 FPS Scroll Scrubber**: Double-buffered HTML5 `<canvas>` rendering engine with automatic cover-fit scaling and nearest-frame caching.
- **Cinematic Visual Effects**: Vignette gradient shading, multi-layer lighting overlays, and dynamic SVG film grain.
- **Quick Scrub Navigation**: Left-rail movement dots with instant preview tooltips allowing visitors to jump between movements.
- **Real Luxury Soundtrack Player**:
  - 🎹 *Gymnopédie No. 1* — Erik Satie (Atelier Piano)
  - 🌙 *Clair de Lune* — Claude Debussy (Midnight Romance)
  - 🎞️ *Viral Reel Audio* — Original social media sound
  - Smooth audio fade in/fade out and responsive animated golden equalizer bars.
- **Bespoke Private Fitting Modal**: Elegant appointment scheduling dialog for bespoke commissions.
- **Fully Responsive & Accessible**: Custom adaptations for desktop, tablet, and mobile with `prefers-reduced-motion` compliance.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **HTML5 Semantic Elements** | Structured DOM, dialog modals, audio elements |
| **Vanilla Modern CSS** | Bespoke design system, glassmorphism, responsive typography |
| **GSAP & ScrollTrigger** | High-performance scrubbed timelines and choreography |
| **HTML5 Canvas 2D API** | WebP image sequence rendering at native device pixel ratios |
| **Web Audio & HTML5 Audio** | Multi-track luxury background music player with fade transitions |
| **Typography** | Cormorant Garamond (display serif) & Jost (editorial sans-serif) |

---

## 🚀 Getting Started Locally

### Prerequisites
You only need a modern web browser and any local static server (e.g. Python, Node.js, or VS Code Live Server).

### 1. Clone the repository
```bash
git clone https://github.com/hello-nazzmul/HEXABOOT.git
cd HEXABOOT
```

### 2. Run locally
Using Python:
```bash
python -m http.server 8080
```

Using Node.js (`npx serve`):
```bash
npx serve .
```

Then visit:
```text
http://localhost:8080/
```

---

## 🌐 Deployment

### Deploy to Vercel

#### Option 1: Automatic GitHub Import
1. Push this repository to your GitHub account (`https://github.com/<your-username>/HEXABOOT`).
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Leave the root directory as `./` and click **"Deploy"**.

#### Option 2: Using Vercel CLI
```bash
# Login to Vercel
npx vercel login

# Deploy production build
npx vercel --prod
```

---

## 📂 Project Structure

```text
HEXABOOT/
├── index.html                   # Core semantic markup & modal dialogs
├── vercel.json                  # Caching rules & clean URLs for Vercel
├── .gitignore                   # Git ignore configuration
├── README.md                    # Project documentation
└── assets/
    ├── css/
    │   └── style.css            # Luxury styling, animations & responsive queries
    ├── js/
    │   ├── app.js               # Canvas frame scrubber, GSAP choreography & audio
    │   ├── gsap.min.js          # GreenSock animation library
    │   └── ScrollTrigger.min.js # GSAP scroll trigger plugin
    ├── img/
    │   └── hexaboot.png         # Brand crest mark
    ├── audio/
    │   ├── atelier_luxury.mp3   # Gymnopédie No. 1 (Erik Satie)
    │   ├── clair_de_lune.mp3    # Clair de Lune (Claude Debussy)
    │   └── reel_audio.m4a       # Reel original audio
    └── frames/                  # 535 WebP high-resolution scrub frames
        ├── frame_00001.webp
        └── ... (frame 1 to 535)
```

---

## 📜 Credits & License

- **Design & Direction**: Nazmul
- **Inspiration**: Savile Row tailoring traditions & Brandon the Web Dev
- **Audio Assets**: Public Domain Classical Archives (Erik Satie, Claude Debussy)
- **License**: MIT
