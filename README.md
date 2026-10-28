# Cinematic Video Editor Portfolio

A production-ready, minimalist, monochrome black-and-white portfolio website designed specifically for freelance video editors, colorists, and motion graphics artists.

Inspired by premium editorial cinema direction, high-contrast monochrome design, generous whitespace, subtle film grain, and 24 FPS timeline aesthetics.

---

## ✨ Features

- **Monochrome Cinematic Aesthetic**: Deep black surfaces (`#070707`), subtle 35mm film grain, stark typography, and hairline borders.
- **Hero Screening Room**: High-impact editorial headline, 24 FPS live badge, interactive portrait frame with corner film marks, and focused value proposition.
- **Dynamic Project Gallery**: Five featured video-editing projects (*Motion Graphics*, *Kung Fu Panda — Typography Edit*, *Bitcoin*, *Girl*, *SaaS Animation*) embedded via Google Drive preview iframes with aspect-ratio management, poster frames, and direct fallback links.
- **Cinematic Video Lightbox Modal**: Click any project to open an interactive modal with Google Drive responsive preview embeds and fallback options, supporting 16:9 widescreen or 9:16 vertical reels with keyboard navigation (`ESC` to exit, `←`/`→` arrow keys to cycle).
- **Dedicated Client Reels Section**: Showcases high-retention client work and commercials with native HTML5 playback and direct Drive links.
- **Other Things I Do (Stills & Marks)**: An editorial visual archive featuring an asymmetric photography masonry gallery and featured Aptive brandmark showcase, complete with a full-screen image lightbox and keyboard navigation.
- **Craft & Editing Philosophy**: Honest, craft-based metrics (timelines cut, years in suite, frame accuracy), philosophy manifesto, and software tool stack.
- **Direct Commission Contact**: Instant copy-to-clipboard email button and direct mailto links for rapid client inquiries — runs on GitHub Pages with **zero backend or paid API keys**.
- **Desktop Custom Cursor**: Smooth physics ring lerp and hover expansion, automatically disabled on touch devices and for users with `prefers-reduced-motion`.
- **Responsive & Accessible**: Seamlessly adapted for mobile phones, tablets, and 4K displays with ARIA attributes and visible focus indicators.

---

## 🚀 Running Locally

Because this site is built with pure standard HTML5, CSS3, and modern Vanilla JavaScript, **no npm install or build step is required**.

### Option 1: Python HTTP Server (Recommended)
Open your terminal in this directory and run:

```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node / npx serve
```bash
npx serve .
```

### Option 3: VS Code Live Server
1. Open this folder in VS Code.
2. Right click `index.html` and click **"Open with Live Server"**.

---

## 🌐 Free Deployment to GitHub Pages

This project uses relative paths (`./css/...`, `./js/...`, `./assets/...`), ensuring it works out-of-the-box on GitHub Pages, including repository subpaths (e.g. `https://username.github.io/portfolio/`).

### Step-by-Step Deployment:

1. **Initialize Git & Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of video editor portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** (top navigation tab).
   - In the left sidebar, click **Pages**.
   - Under **Build and deployment > Branch**, select `main` and `/ (root)`.
   - Click **Save**.

3. **Your Site is Live!**:
   - In 1–2 minutes, GitHub will publish your site at:
     `https://<your-username>.github.io/<your-repo-name>/`

---

## ⚙️ Customization Guide

All personal info, projects, videos, and services are managed cleanly in a single configuration file: `js/config.js`.

### 1. Change Name, Email & Bio
Open `js/config.js` and edit the `author` object:
```javascript
author: {
  firstName: "YOUR FIRST NAME",
  lastName: "YOUR LAST NAME",
  title: "Freelance Video Editor & Motion Artist",
  email: "your.email@example.com",
  availability: "Available for Projects (Q2 2026)",
  bio: "Your personal editing bio...",
  stats: [ ... ]
}
```

### 2. Replace Hero Portrait
Place your photo in `assets/images/hero-portrait.jpg` (or change the path in `index.html` and `js/config.js`).

### 3. Add or Edit Projects
In `js/config.js`, modify items in `PORTFOLIO_CONFIG.projects`:
```javascript
{
  id: "project-1",
  title: "Your Project Title",
  category: "shortform", // "shortform", "documentary", "commercial", or "motion"
  categoryLabel: "High-Retention Reel",
  duration: "00:45",
  aspectRatio: "9:16", // "9:16" for vertical reels or "16:9" for horizontal
  specs: "9:16 • 60 FPS • 4K",
  thumbnail: "./assets/images/project-reel.jpg",
  videoUrl: "./assets/videos/sample.mp4", // Or YouTube embed: "https://www.youtube.com/embed/VIDEO_ID"
  videoType: "mp4", // "mp4" or "embed"
  summary: "Brief project overview...",
  tools: ["Premiere Pro", "After Effects"],
  role: "Lead Editor & Sound Designer"
}
```

### 4. Setting Up YouTube or Vimeo Embeds
To use a YouTube video in the Showreel or any project modal:
1. In `js/config.js`, set `videoType: "embed"`.
2. Set `videoUrl: "https://www.youtube.com/embed/YOUR_VIDEO_ID"`.

---

## 📁 File Structure

```
Portfolio/
├── index.html            # Main semantic HTML5 document
├── README.md             # Documentation & deployment guide
├── css/
│   └── style.css         # Complete monochrome design system & responsive layout
├── js/
│   ├── config.js         # Single-source configuration for content & projects
│   └── main.js           # Modal player, filters, custom cursor, zero-backend form
└── assets/
    ├── images/
    │   ├── hero-portrait.jpg      # Editor portrait photo
    │   ├── showreel-poster.jpg    # Showreel video cover
    │   ├── project-doc.jpg        # Documentary frame still
    │   ├── project-reel.jpg       # Vertical reel frame still
    │   ├── project-podcast.jpg    # Podcast studio frame still
    │   ├── project-commercial.jpg # Commercial frame still
    │   └── project-motion.jpg     # Motion graphics frame still
    └── videos/
        └── sample.mp4             # Local offline sample MP4 video
```

---

## 🛡️ License

Free to use and modify for personal or commercial portfolios.
