/**
 * PORTFOLIO CONFIGURATION
 * ----------------------------------------------------------------------
 * Easily customize all details, project links, videos, and social profiles
 * from this single configuration file.
 * ----------------------------------------------------------------------
 */

const PORTFOLIO_CONFIG = {
  // Personal & Brand Information
  author: {
    firstName: "VAMSI",
    lastName: "",
    title: "Freelance Video Editor",
    tagline: "Cut to emotion. Paced for retention.",
    location: "New York & Remote Worldwide",
    availability: "Available for Select Commissions (Q2 2026)",
    email: "vamsi13864@gmail.com",
    bio: "I turn raw footage into edits people actually watch. From sharp hooks and precise pacing to kinetic typography, clean transitions, and layered sound design, every cut has a purpose. No unnecessary effects. No wasted seconds. Just edits built to hold attention and make an impact.",
    stats: [
      { number: "650+", label: "Videos Delivered", description: "Timelines cut across short-form & narrative" },
      { number: "7+ YRS", label: "Timeline Craft", description: "Deep mastery of rhythm, pacing & story" },
      { number: "24 FPS", label: "Frame Precision", description: "Frame-accurate audio sync & motion" },
      { number: "100%", label: "Deadline Track", description: "Dependable, transparent delivery pipelines" }
    ]
  },

  // Social Links
  socials: [
    { name: "Instagram", url: "https://www.instagram.com/iam.vamsiguptha/", handle: "@iam.vamsiguptha" }
  ],

  // Showreel Video Data
  showreel: {
    title: "2026 Commercial & Narrative Showreel",
    aspect: "16:9",
    category: "Director's Cut",
    duration: "01:24",
    poster: "./assets/images/showreel-poster.jpg",
    // Can be local MP4 path ("./assets/videos/sample.mp4") or YouTube embed ("https://www.youtube.com/embed/ScMzIvxBSi4")
    videoUrl: "./assets/videos/sample.mp4",
    videoType: "mp4", // 'mp4' or 'embed'
    description: "A fast-paced curation of narrative pacing, documentary flow, commercial grading, and kinetic sound design."
  },

  // Project Categories for Filter Tabs (Matching the 5 Actual Projects)
  categories: [
    { id: "all", label: "All Works" },
    { id: "motion", label: "Motion Graphics" },
    { id: "typography", label: "Entertainment / Typography" },
    { id: "crypto", label: "Finance / Crypto" },
    { id: "cinematic", label: "Anime / Cinematic" },
    { id: "saas", label: "SaaS / Product" }
  ],

  // Selected Works Gallery (5 Featured Projects embedded via Google Drive)
  projects: [
    {
      id: "project-1",
      title: "Motion Graphics",
      category: "motion",
      categoryLabel: "Motion Graphics",
      duration: "00:08",
      aspectRatio: "9:16",
      cardRatio: "4:5",
      specs: "9:16 • Vertical • 60 FPS",
      thumbnail: "./assets/images/thumb-motion-graphics.jpg",
      driveFileId: "1Tm90c6JNVbv6pGNq_GMyQQakhCF1Eikf",
      drivePreviewUrl: "https://drive.google.com/file/d/1Tm90c6JNVbv6pGNq_GMyQQakhCF1Eikf/preview",
      driveViewUrl: "https://drive.google.com/file/d/1Tm90c6JNVbv6pGNq_GMyQQakhCF1Eikf/view",
      videoUrl: "./assets/videos/motion-graphics.mp4",
      localVideoFallback: "./assets/videos/motion-graphics.mp4",
      videoType: "direct",
      summary: "A motion-design project demonstrating visual composition, kinetic typography, dynamic animation curves, and graphic movement.",
      tools: ["After Effects", "Premiere Pro", "Illustrator"],
      role: "Motion Designer & Compositor"
    },
    {
      id: "project-2",
      title: "Kung Fu Panda — Typography Edit",
      category: "typography",
      categoryLabel: "Entertainment / Typography",
      duration: "00:17",
      aspectRatio: "16:9",
      cardRatio: "4:5",
      specs: "16:9 • 1080p • 24 FPS",
      thumbnail: "./assets/images/thumb-kungfu-panda.jpg",
      driveFileId: "1C_pS1wKfxt_W9s32ntdqPRz_mCA-ybAL",
      drivePreviewUrl: "https://drive.google.com/file/d/1C_pS1wKfxt_W9s32ntdqPRz_mCA-ybAL/preview",
      driveViewUrl: "https://drive.google.com/file/d/1C_pS1wKfxt_W9s32ntdqPRz_mCA-ybAL/view?usp=drive_link",
      videoUrl: "./assets/videos/kungfu-panda.mp4",
      localVideoFallback: "./assets/videos/kungfu-panda.mp4",
      videoType: "direct",
      summary: "A typography-driven entertainment edit featuring playful text treatment, rhythmic beat synchronization, and dynamic comedic pacing.",
      tools: ["Premiere Pro", "After Effects", "Audition"],
      role: "Lead Editor & Typography Animator"
    },
    {
      id: "project-3",
      title: "Bitcoin",
      category: "crypto",
      categoryLabel: "Finance / Crypto",
      duration: "00:04",
      aspectRatio: "9:16",
      cardRatio: "4:5",
      specs: "9:16 • Vertical • 60 FPS",
      thumbnail: "./assets/images/thumb-bitcoin.jpg",
      driveFileId: "1MzWiLKSehMfJ2V9mulx7IxSyoKJfjRAC",
      drivePreviewUrl: "https://drive.google.com/file/d/1MzWiLKSehMfJ2V9mulx7IxSyoKJfjRAC/preview",
      driveViewUrl: "https://drive.google.com/file/d/1MzWiLKSehMfJ2V9mulx7IxSyoKJfjRAC/view",
      videoUrl: "./assets/videos/bitcoin.mp4",
      localVideoFallback: "./assets/videos/bitcoin.mp4",
      videoType: "direct",
      summary: "A short-form Bitcoin-themed financial edit engineered with punchy hooks, motion tracking, and high-impact visual retention.",
      tools: ["Premiere Pro", "After Effects", "Soundly"],
      role: "Short-Form Editor & Motion Cut"
    },
    {
      id: "project-4",
      title: "Girl",
      category: "cinematic",
      categoryLabel: "Anime / Cinematic Edit",
      duration: "00:04",
      aspectRatio: "16:9",
      cardRatio: "16:9",
      specs: "16:9 • Cinematic 24 FPS",
      thumbnail: "./assets/images/thumb-girl.jpg",
      driveFileId: "10JKWezMDml8Qs7-npdWXwpa9ZD4eCkzS",
      drivePreviewUrl: "https://drive.google.com/file/d/10JKWezMDml8Qs7-npdWXwpa9ZD4eCkzS/preview",
      driveViewUrl: "https://drive.google.com/file/d/10JKWezMDml8Qs7-npdWXwpa9ZD4eCkzS/view",
      videoUrl: "./assets/videos/girl.mp4",
      localVideoFallback: "./assets/videos/girl.mp4",
      videoType: "direct",
      summary: "A cinematic anime edit using atmospheric imagery, dramatic lighting contrast, rich color palettes, and evocative warm tones.",
      tools: ["DaVinci Resolve Studio", "Premiere Pro"],
      role: "Colorist & Cinematic Editor"
    },
    {
      id: "project-5",
      title: "SaaS Animation",
      category: "saas",
      categoryLabel: "SaaS / Product Animation",
      duration: "00:07",
      aspectRatio: "16:9",
      cardRatio: "16:9",
      specs: "16:9 • 60 FPS • UI Motion",
      thumbnail: "./assets/images/thumb-saas.jpg",
      driveFileId: "1Jsfc35NcyULuWbc35Ep8saRBKeruuzxr",
      drivePreviewUrl: "https://drive.google.com/file/d/1Jsfc35NcyULuWbc35Ep8saRBKeruuzxr/preview",
      driveViewUrl: "https://drive.google.com/file/d/1Jsfc35NcyULuWbc35Ep8saRBKeruuzxr/view",
      videoUrl: "./assets/videos/saas-animation.mp4",
      localVideoFallback: "./assets/videos/saas-animation.mp4",
      videoType: "direct",
      summary: "A SaaS-focused motion graphics piece featuring communication notifications, dimensional UI cards, product-animation visuals, and clean interface interactions.",
      tools: ["After Effects", "Premiere Pro", "Figma"],
      role: "UI Motion Designer & Editor"
    }
  ],

  /**
   * CLIENT REELS CONFIGURATION
   * ----------------------------------------------------------------------
   * Client reels showcased in the Client Reels section.
   * Labels are editable. Playback runs inline within the card.
   * ----------------------------------------------------------------------
   */
  clientReels: [
    {
      id: "client-reel-1",
      label: "CLIENT REEL 01",
      driveFileId: "13wOQtufaQe0v8Bn4QhWNKrUYgsTJ4VT0",
      driveViewUrl: "https://drive.google.com/file/d/13wOQtufaQe0v8Bn4QhWNKrUYgsTJ4VT0/view",
      drivePreviewUrl: "https://drive.google.com/file/d/13wOQtufaQe0v8Bn4QhWNKrUYgsTJ4VT0/preview",
      videoUrl: "./assets/videos/client-reel-01.mp4",
      localVideoFallback: "./assets/videos/client-reel-01.mp4",
      videoType: "direct",
      thumbnail: "./assets/images/thumb-client-reel-01.jpg",
      aspectRatio: "9:16"
    },
    {
      id: "client-reel-2",
      label: "CLIENT REEL 02",
      driveFileId: "19ikrT142NdVxGb5MTTfUifBvbaq3RPdN",
      driveViewUrl: "https://drive.google.com/file/d/19ikrT142NdVxGb5MTTfUifBvbaq3RPdN/view",
      drivePreviewUrl: "https://drive.google.com/file/d/19ikrT142NdVxGb5MTTfUifBvbaq3RPdN/preview",
      videoUrl: "./assets/videos/client-reel-02.mp4",
      localVideoFallback: "./assets/videos/client-reel-02.mp4",
      videoType: "direct",
      thumbnail: "./assets/images/thumb-client-reel-02.jpg",
      aspectRatio: "9:16"
    }
  ],

  /**
   * OTHER THINGS I DO
   * ----------------------------------------------------------------------
   * Creative pursuits beyond the timeline:
   * Stills & Photography gallery, plus featured Aptive logo design.
   * ----------------------------------------------------------------------
   */
  otherWork: {
    heading: "OTHER THINGS I DO",
    subtitle: "Photography, visual experiments, and the occasional idea beyond the timeline.",
    photography: [
      {
        id: "photo-1",
        src: "./assets/images/my camera/IMG_20260606_193452.jpg",
        title: "Silhouette Walk",
        category: "Monochrome • Rooftop",
        aspect: "portrait",
        aspectRatio: "3:4",
        dimensions: "3072 × 4096",
        alt: "High-contrast monochrome silhouette of two monkeys walking along a rooftop wall"
      },
      {
        id: "photo-2",
        src: "./assets/images/my camera/IMG_20261020_153226.jpg",
        title: "Timex Archive",
        category: "Still Life • Macro",
        aspect: "panoramic",
        aspectRatio: "21:9",
        dimensions: "4096 × 1844",
        alt: "Cinematic close-up macro of vintage Timex watch on dark wood surface"
      },
      {
        id: "photo-3",
        src: "./assets/images/my camera/IMG_20251224_074529.jpg",
        title: "Morning Embrace",
        category: "Wildlife • Natural Light",
        aspect: "portrait",
        aspectRatio: "3:4",
        dimensions: "3072 × 4096",
        alt: "Mother monkey embracing baby monkey on a terrace ledge against city rooftops"
      },
      {
        id: "photo-4",
        src: "./assets/images/my camera/JANUARY.png",
        title: "January Studies",
        category: "Typography & Light",
        aspect: "landscape",
        aspectRatio: "16:9",
        dimensions: "1920 × 1080",
        alt: "Visual experiment with amber JANUARY typography and beverage cans in warm ambient light"
      },
      {
        id: "photo-5",
        src: "./assets/images/my camera/IMG_20250705_175804.jpg",
        title: "Solstice Sky",
        category: "Atmosphere • Dusk",
        aspect: "landscape",
        aspectRatio: "4:3",
        dimensions: "4096 × 3072",
        alt: "Golden sun breaking through dark clouds over urban skyline"
      },
      {
        id: "photo-6",
        src: "./assets/images/my camera/IMG_20261002_193050.jpg",
        title: "Nocturnal Grid",
        category: "Urban Nightscape",
        aspect: "panoramic",
        aspectRatio: "21:9",
        dimensions: "4096 × 1844",
        alt: "Atmospheric night photograph of modern apartment high-rises and floodlights"
      },
      {
        id: "photo-7",
        src: "./assets/images/my camera/IMG_20251224_074601.jpg",
        title: "Rooftop Quartet",
        category: "Wildlife • Series",
        aspect: "portrait",
        aspectRatio: "3:4",
        dimensions: "3072 × 4096",
        alt: "Family group of four monkeys perched along a weathered rooftop ledge"
      },
      {
        id: "photo-8",
        src: "./assets/images/my camera/IMG_20251224_074539.jpg",
        title: "Roofline Duo",
        category: "Wildlife • Rooftop",
        aspect: "portrait",
        aspectRatio: "3:4",
        dimensions: "3072 × 4096",
        alt: "Two monkeys perched high on a rooftop against a bright morning sky"
      }
    ],
    logo: {
      id: "logo-aptive",
      src: "./assets/images/my camera/3rd variation.png",
      title: "Aptive",
      label: "LOGO DESIGN — APTIVE",
      category: "Brand Identity • Mark",
      aspectRatio: "1:1",
      dimensions: "2000 × 2000",
      description: "Custom geometric brandmark combining a precision drafting compass silhouette with dynamic letterform 'A'. Built on rigorous mathematical proportions for architectural clarity and visual impact.",
      alt: "Aptive logo mark featuring drafting compass forming the letter A on a pure black background"
    }
  }
};

