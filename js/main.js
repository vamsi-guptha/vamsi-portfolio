/**
 * ==========================================================================
 * MAIN JAVASCRIPT ENGINE
 * Handles Video Lightbox, Filtering, Custom Cursor, Scrollspy, and Forms
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Content from Config
  initAuthorAndBrand();
  initProjectsFilter();
  renderProjects('all');
  renderClientReels();
  renderSocials();
  renderPhotoGallery();

  // 2. Initialize Interactive Systems
  initCustomCursor();
  initNavigation();
  initMobileMenu();
  initScrollReveals();
  initVideoModal();
  initPhotoLightbox();
  initCopyEmail();
  initLiveClock();
});

/* -------------------------------------------------------------------------- */
/* 1. CONTENT HYDRATION FROM CONFIG                                            */
/* -------------------------------------------------------------------------- */

function initAuthorAndBrand() {
  const cfg = PORTFOLIO_CONFIG.author;
  if (!cfg) return;

  const fullName = `${cfg.firstName}${cfg.lastName ? ' ' + cfg.lastName : ''}`.trim();

  // Set document title
  document.title = `${fullName} — ${cfg.title}`;

  // Update text placeholders
  const nameEls = document.querySelectorAll('.author-name-full');
  nameEls.forEach(el => el.textContent = fullName);

  const titleEls = document.querySelectorAll('.author-title');
  titleEls.forEach(el => el.textContent = cfg.title);

  const availEls = document.querySelectorAll('.author-availability');
  availEls.forEach(el => el.textContent = cfg.availability);

  const emailEls = document.querySelectorAll('.author-email-text');
  emailEls.forEach(el => {
    el.textContent = cfg.email;
    if (el.tagName === 'A') el.href = `mailto:${cfg.email}`;
  });

  const emailBtns = document.querySelectorAll('.author-email-link');
  emailBtns.forEach(btn => {
    btn.href = `mailto:${cfg.email}`;
  });

  // Render Stats
  const statsContainer = document.getElementById('statsGrid');
  if (statsContainer && cfg.stats) {
    statsContainer.innerHTML = cfg.stats.map((st, i) => `
      <div class="stat-box reveal reveal-delay-${(i % 3) + 1}">
        <div class="stat-num">${st.number}</div>
        <div class="stat-lbl">${st.label}</div>
        <div class="stat-desc">${st.description}</div>
      </div>
    `).join('');
  }
}


function initProjectsFilter() {
  const filterContainer = document.getElementById('filterTabs');
  if (!filterContainer) return;

  filterContainer.innerHTML = PORTFOLIO_CONFIG.categories.map(cat => `
    <button class="filter-btn ${cat.id === 'all' ? 'active' : ''}" data-cat="${cat.id}">
      ${cat.label}
    </button>
  `).join('');

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const catId = btn.getAttribute('data-cat');
    renderProjects(catId);
  });
}

function renderProjects(category = 'all') {
  const grid = document.getElementById('workGrid');
  if (!grid) return;

  const projects = category === 'all' 
    ? PORTFOLIO_CONFIG.projects 
    : PORTFOLIO_CONFIG.projects.filter(p => p.category === category);

  grid.innerHTML = projects.map((p, index) => {
    const isVertical = p.cardRatio === '4:5' || p.aspectRatio === '9:16' || p.id === 'project-1' || p.id === 'project-2' || p.id === 'project-3';
    const aspectClass = isVertical ? 'vertical-card aspect-4-5' : 'horizontal-card aspect-16-9';
    return `
      <article class="work-card reveal reveal-delay-${(index % 3) + 1}" data-id="${p.id}" tabindex="0" role="button" aria-label="Open project ${p.title}">
        <div class="wc-media ${aspectClass}">
          <img src="${p.thumbnail}" alt="${p.title}" class="wc-thumb" loading="lazy">
          <div class="wc-vignette"></div>
          <button type="button" class="wc-play-badge" aria-label="Play ${p.title} video">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>
        <div class="wc-body">
          <div class="wc-meta">
            <span class="wc-cat">${p.categoryLabel}</span>
            <span class="wc-duration">${p.duration}</span>
          </div>
          <h3 class="wc-title">${p.title}</h3>
          <p class="wc-desc">${p.summary}</p>
        </div>
      </article>
    `;
  }).join('');

  // Re-observe new elements for reveal animation
  initScrollReveals();

  // Attach card click handlers for inline video playback
  attachInlineVideoListeners(grid);
}

/**
 * Stop all active inline video players across all project cards
 */
function stopAllInlineVideos(exceptCard = null) {
  const cards = document.querySelectorAll('.work-card.is-playing');
  cards.forEach(card => {
    if (card === exceptCard) return;
    const mediaContainer = card.querySelector('.wc-media');
    const player = mediaContainer ? mediaContainer.querySelector('.wc-inline-player') : null;
    if (player) {
      const vid = player.querySelector('video');
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
      }
      player.remove();
    }
    card.classList.remove('is-playing');
  });

  // Cross-stop any playing client reels
  stopAllClientReelVideos(exceptCard);
}

/**
 * Play project video inline inside card's media container with clean controls
 */
function playProjectInline(card) {
  const pid = card.getAttribute('data-id');
  const project = PORTFOLIO_CONFIG.projects.find(x => x.id === pid);
  if (!project) return;

  const mediaContainer = card.querySelector('.wc-media');
  if (!mediaContainer) return;

  // If already playing in this card, toggle play/pause for native video
  if (card.classList.contains('is-playing')) {
    const existingVideo = mediaContainer.querySelector('video');
    if (existingVideo) {
      if (existingVideo.paused) {
        existingVideo.play();
      } else {
        existingVideo.pause();
      }
      return;
    }
  }

  // Stop any other currently playing project videos
  stopAllInlineVideos(card);

  // Mark this card as playing
  card.classList.add('is-playing');

  // Build minimal inline player container
  const playerWrap = document.createElement('div');
  playerWrap.className = 'wc-inline-player';

  const directVideoSrc = project.videoUrl || project.localVideoFallback;
  const viewUrl = project.driveViewUrl || (project.driveFileId ? `https://drive.google.com/file/d/${project.driveFileId}/view` : '#');

  if (directVideoSrc) {
    playerWrap.innerHTML = `
      <button type="button" class="wc-close-video-btn" aria-label="Close video" title="Close video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <video class="wc-custom-video" playsinline preload="auto">
        <source src="${directVideoSrc}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
      <div class="wc-playback-indicator" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="wc-inline-fallback" style="display: none;">
        <span class="wc-inline-fallback-text">Unable to play video directly.</span>
        <a href="${viewUrl}" target="_blank" rel="noopener noreferrer" class="wc-inline-fallback-link">
          Watch on Google Drive ↗
        </a>
      </div>
    `;

    const videoEl = playerWrap.querySelector('video');
    const fallback = playerWrap.querySelector('.wc-inline-fallback');

    // Start playback immediately from user interaction
    videoEl.play().catch(() => {
      // If unmuted autoplay is blocked by browser policy, play muted with sound unmute on interaction
      videoEl.muted = true;
      videoEl.play().catch(() => {
        if (fallback) fallback.style.display = 'flex';
      });
    });

    videoEl.addEventListener('play', () => {
      playerWrap.classList.remove('is-paused');
    });

    videoEl.addEventListener('pause', () => {
      playerWrap.classList.add('is-paused');
    });

    // Clicking the video toggles pause / play
    videoEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    });

    // Reset when ended
    videoEl.addEventListener('ended', () => {
      playerWrap.remove();
      card.classList.remove('is-playing');
    });

    videoEl.addEventListener('error', () => {
      if (fallback) fallback.style.display = 'flex';
    });
  } else {
    // If no direct video source exists, display fallback link
    playerWrap.innerHTML = `
      <button type="button" class="wc-close-video-btn" aria-label="Close video" title="Close video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="wc-inline-fallback" style="display: flex;">
        <span class="wc-inline-fallback-text">Direct video source not available.</span>
        <a href="${viewUrl}" target="_blank" rel="noopener noreferrer" class="wc-inline-fallback-link">
          Watch on Google Drive ↗
        </a>
      </div>
    `;
  }

  // Handle Close button click
  const closeBtn = playerWrap.querySelector('.wc-close-video-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = playerWrap.querySelector('video');
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
      }
      playerWrap.remove();
      card.classList.remove('is-playing');
    });
  }

  mediaContainer.appendChild(playerWrap);
}

/**
 * Attach listeners to project cards for inline video playback
 */
function attachInlineVideoListeners(container = document) {
  container.querySelectorAll('.work-card').forEach(card => {
    // Media click or play button click triggers inline playback
    const media = card.querySelector('.wc-media');
    const playBadge = card.querySelector('.wc-play-badge');
    const playTrigger = card.querySelector('.wc-play-trigger');

    const handlePlay = (e) => {
      // Don't trigger if clicking close button, direct link, or when already playing
      if (e.target.closest('.wc-close-video-btn') || e.target.closest('.wc-inline-player') || e.target.closest('a')) {
        return;
      }
      playProjectInline(card);
    };

    card.addEventListener('click', handlePlay);

    if (playBadge) {
      playBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        playProjectInline(card);
      });
    }

    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('is-playing')) {
        e.preventDefault();
        playProjectInline(card);
      }
    });
  });
}

/**
 * Stop all active inline video players across all client reel cards
 */
function stopAllClientReelVideos(exceptCard = null) {
  const cards = document.querySelectorAll('.client-reel-card.is-playing');
  cards.forEach(card => {
    if (card === exceptCard) return;
    const mediaContainer = card.querySelector('.cr-media');
    const player = mediaContainer ? mediaContainer.querySelector('.cr-inline-player') : null;
    if (player) {
      const vid = player.querySelector('video');
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
      }
      player.remove();
    }
    card.classList.remove('is-playing');
  });
}

/**
 * Play client reel video inline inside card's media container with custom HTML5 player
 */
function playClientReelInline(card) {
  const reelId = card.getAttribute('data-id');
  const reel = (PORTFOLIO_CONFIG.clientReels || []).find(x => x.id === reelId);
  if (!reel) return;

  const mediaContainer = card.querySelector('.cr-media');
  if (!mediaContainer) return;

  // If already playing in this card, toggle play/pause
  if (card.classList.contains('is-playing')) {
    const existingVideo = mediaContainer.querySelector('video');
    if (existingVideo) {
      if (existingVideo.paused) {
        existingVideo.play();
      } else {
        existingVideo.pause();
      }
      return;
    }
  }

  // Stop any other currently playing project or client reel videos
  stopAllInlineVideos();
  stopAllClientReelVideos(card);

  // Mark this card as playing
  card.classList.add('is-playing');

  // Build minimal custom inline player container
  const playerWrap = document.createElement('div');
  playerWrap.className = 'cr-inline-player';

  const directVideoSrc = reel.videoUrl || reel.localVideoFallback;
  const viewUrl = reel.driveViewUrl || (reel.driveFileId ? `https://drive.google.com/file/d/${reel.driveFileId}/view` : '#');

  if (directVideoSrc) {
    playerWrap.innerHTML = `
      <button type="button" class="cr-close-video-btn" aria-label="Close video" title="Close video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <video class="cr-custom-video" playsinline preload="auto">
        <source src="${directVideoSrc}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
      <div class="cr-playback-indicator" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
      <div class="cr-inline-fallback" style="display: none;">
        <span class="cr-inline-fallback-text">Unable to play video directly.</span>
        <a href="${viewUrl}" target="_blank" rel="noopener noreferrer" class="cr-inline-fallback-link">
          Watch on Google Drive ↗
        </a>
      </div>
    `;

    const videoEl = playerWrap.querySelector('video');
    const fallback = playerWrap.querySelector('.cr-inline-fallback');

    // Start playback immediately from user interaction
    videoEl.play().catch(() => {
      videoEl.muted = true;
      videoEl.play().catch(() => {
        if (fallback) fallback.style.display = 'flex';
      });
    });

    videoEl.addEventListener('play', () => {
      playerWrap.classList.remove('is-paused');
    });

    videoEl.addEventListener('pause', () => {
      playerWrap.classList.add('is-paused');
    });

    videoEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    });

    videoEl.addEventListener('ended', () => {
      playerWrap.remove();
      card.classList.remove('is-playing');
    });

    videoEl.addEventListener('error', () => {
      if (fallback) fallback.style.display = 'flex';
    });
  } else {
    // Fallback if direct video file missing
    playerWrap.innerHTML = `
      <button type="button" class="cr-close-video-btn" aria-label="Close video" title="Close video">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <div class="cr-inline-fallback" style="display: flex;">
        <span class="cr-inline-fallback-text">Direct video source not available.</span>
        <a href="${viewUrl}" target="_blank" rel="noopener noreferrer" class="cr-inline-fallback-link">
          Watch on Google Drive ↗
        </a>
      </div>
    `;
  }

  // Handle Close button click
  const closeBtn = playerWrap.querySelector('.cr-close-video-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = playerWrap.querySelector('video');
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.load();
      }
      playerWrap.remove();
      card.classList.remove('is-playing');
    });
  }

  mediaContainer.appendChild(playerWrap);
}

/**
 * Attach listeners to client reel cards for inline video playback
 */
function attachClientReelInlineVideoListeners(container = document) {
  container.querySelectorAll('.client-reel-card').forEach(card => {
    const playBadge = card.querySelector('.cr-play-badge');

    const handlePlay = (e) => {
      // Don't trigger if clicking close button, direct link, or when already playing
      if (e.target.closest('.cr-close-video-btn') || e.target.closest('.cr-inline-player') || e.target.closest('a')) {
        return;
      }
      playClientReelInline(card);
    };

    card.addEventListener('click', handlePlay);

    if (playBadge) {
      playBadge.addEventListener('click', (e) => {
        e.stopPropagation();
        playClientReelInline(card);
      });
    }

    card.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !card.classList.contains('is-playing')) {
        e.preventDefault();
        playClientReelInline(card);
      }
    });
  });
}

/**
 * Render Client Reels section.
 * Renders interactive reel cards with original colors, centered play button, and inline playback.
 */
function renderClientReels() {
  const container = document.getElementById('clientReelsWrap');
  if (!container) return;

  const reels = PORTFOLIO_CONFIG.clientReels || [];

  if (reels.length === 0) {
    container.innerHTML = `
      <div class="client-reels-placeholder reveal">
        <div class="cr-placeholder-badge">CURATED ARCHIVE</div>
        <h3 class="cr-placeholder-title">Selected client work coming soon.</h3>
        <p class="cr-placeholder-desc">
          Currently prepping high-retention short-form reels, commercial spots, and executive edits for upcoming public showcase.
        </p>
        <a href="#contact" class="btn btn-ghost cr-placeholder-cta">
          Commission a Project
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="client-reels-grid">
      ${reels.map((reel, idx) => `
        <article class="client-reel-card reveal reveal-delay-${(idx % 2) + 1}" data-id="${reel.id}" tabindex="0" role="button" aria-label="Play ${reel.label || 'Client Reel'}">
          <div class="cr-media">
            <img src="${reel.thumbnail}" alt="${reel.label || 'Client Reel'}" class="cr-thumb" loading="lazy">
            <div class="cr-vignette"></div>
            <button type="button" class="cr-play-badge" aria-label="Play ${reel.label || 'Client Reel'} video">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="cr-body">
            <h3 class="cr-label">${reel.label || ('CLIENT REEL 0' + (idx + 1))}</h3>
            <a href="${reel.driveViewUrl}" target="_blank" rel="noopener noreferrer" class="cr-fallback-link" title="Open fallback in Google Drive" aria-label="Open ${reel.label || 'Client Reel'} in Google Drive">
              <span>DRIVE</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </article>
      `).join('')}
    </div>
  `;

  initScrollReveals();
  attachClientReelInlineVideoListeners(container);
}





function renderSocials() {
  const container = document.getElementById('socialsWrap');
  if (!container || !PORTFOLIO_CONFIG.socials) return;

  const icons = {
    Instagram: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`
  };

  container.innerHTML = PORTFOLIO_CONFIG.socials.map(soc => `
    <a href="${soc.url}" target="_blank" rel="noopener noreferrer" class="social-badge">
      ${icons[soc.name] || ''}
      <span>${soc.name}</span>
    </a>
  `).join('');
}

/* -------------------------------------------------------------------------- */
/* 2. VIDEO MODAL / LIGHTBOX                                                  */
/* -------------------------------------------------------------------------- */

let currentProjectIndex = -1;

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  if (!modal || !closeBtn) return;

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    const wrapper = document.getElementById('modalPlayerWrapper');
    if (wrapper) {
      wrapper.innerHTML = ''; // Stops all playing videos / iframes immediately
    }
  }

  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeModal();
    } else if (e.key === 'ArrowRight') {
      navigateModalProject(1);
    } else if (e.key === 'ArrowLeft') {
      navigateModalProject(-1);
    }
  });
}

function openVideoModal(project) {
  const modal = document.getElementById('videoModal');
  const wrapper = document.getElementById('modalPlayerWrapper');
  const titleEl = document.getElementById('modalTitle');
  const badgeEl = document.getElementById('modalBadge');
  const descEl = document.getElementById('modalDesc');
  const toolsEl = document.getElementById('modalTools');
  const roleEl = document.getElementById('modalRole');
  const specsEl = document.getElementById('modalSpecs');

  if (!modal || !wrapper) return;

  currentProjectIndex = PORTFOLIO_CONFIG.projects.findIndex(p => p.id === project.id);

  if (titleEl) titleEl.textContent = project.title;
  if (badgeEl) badgeEl.textContent = project.categoryLabel;
  if (descEl) descEl.textContent = project.summary;
  if (toolsEl) toolsEl.textContent = project.tools.join(', ');
  if (roleEl) roleEl.textContent = project.role;
  if (specsEl) specsEl.textContent = project.specs;

  // Adapt container format
  const isVertical = project.aspectRatio === '9:16';
  wrapper.className = isVertical ? 'modal-player-wrapper is-vertical' : 'modal-player-wrapper';

  const driveActionEl = document.getElementById('modalDriveAction');
  if (driveActionEl) {
    if (project.driveViewUrl) {
      driveActionEl.innerHTML = `
        <a href="${project.driveViewUrl}" target="_blank" rel="noopener noreferrer" class="modal-gdrive-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          <span>Open Original in Google Drive</span>
        </a>
      `;
    } else {
      driveActionEl.innerHTML = '';
    }
  }

  // Inject Player
  if (project.videoType === 'gdrive' || (project.videoUrl && project.videoUrl.includes('drive.google.com'))) {
    const previewUrl = project.drivePreviewUrl || project.videoUrl;
    const viewUrl = project.driveViewUrl || previewUrl.replace('/preview', '/view');
    wrapper.innerHTML = `
      <iframe 
        src="${previewUrl}" 
        title="${project.title} — Google Drive Preview" 
        loading="lazy"
        allow="autoplay; fullscreen" 
        allowfullscreen>
      </iframe>
      <div class="modal-embed-fallback">
        <span>If video preview does not load:</span>
        <a href="${viewUrl}" target="_blank" rel="noopener noreferrer">Watch on Google Drive ↗</a>
      </div>
    `;
  } else if (project.videoType === 'embed' || project.videoUrl.includes('youtube.com') || project.videoUrl.includes('vimeo.com')) {
    wrapper.innerHTML = `
      <iframe src="${project.videoUrl}?autoplay=1&rel=0" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>
    `;
  } else {
    wrapper.innerHTML = `
      <video controls playsinline preload="metadata">
        <source src="${project.videoUrl}" type="video/mp4">
        Your browser does not support HTML5 video.
      </video>
    `;
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function navigateModalProject(direction) {
  const projects = PORTFOLIO_CONFIG.projects;
  if (projects.length === 0) return;

  currentProjectIndex = (currentProjectIndex + direction + projects.length) % projects.length;
  openVideoModal(projects[currentProjectIndex]);
}

/* -------------------------------------------------------------------------- */
/* 2B. EDITORIAL PHOTOGRAPHY MASONRY & LIGHTBOX                               */
/* -------------------------------------------------------------------------- */

let currentPhotoIndex = -1;
let lastActivePhotoTrigger = null;
let openPhotoLightboxFn = null;
let currentGalleryCols = 0;

function getAllPhotoItems() {
  if (!PORTFOLIO_CONFIG.otherWork) return [];
  const photos = PORTFOLIO_CONFIG.otherWork.photography || [];
  const logo = PORTFOLIO_CONFIG.otherWork.logo ? [{
    id: PORTFOLIO_CONFIG.otherWork.logo.id,
    src: PORTFOLIO_CONFIG.otherWork.logo.src,
    title: PORTFOLIO_CONFIG.otherWork.logo.label || 'LOGO DESIGN — APTIVE',
    category: PORTFOLIO_CONFIG.otherWork.logo.category || 'Brand Identity • Mark',
    dimensions: PORTFOLIO_CONFIG.otherWork.logo.dimensions || '2000 × 2000',
    alt: PORTFOLIO_CONFIG.otherWork.logo.alt || 'Aptive Logo Design'
  }] : [];
  return [...photos, ...logo];
}

/**
 * Renders or redistributes the photography gallery into independent vertical column stacks.
 * Desktop: 3 columns with balanced aspect-ratio distribution.
 * Tablet: 2 columns evenly split.
 * Mobile: 1 single vertical column.
 */
function renderPhotoGallery(force = false) {
  const container = document.getElementById('photoGalleryWrap');
  if (!container || !PORTFOLIO_CONFIG.otherWork) return;

  const photos = PORTFOLIO_CONFIG.otherWork.photography || [];
  if (photos.length === 0) return;

  const width = window.innerWidth;
  let targetCols = 3;
  if (width <= 640) {
    targetCols = 1;
  } else if (width <= 992) {
    targetCols = 2;
  } else {
    targetCols = 3;
  }

  // Avoid unnecessary re-rendering if columns haven't changed and DOM is present
  if (!force && targetCols === currentGalleryCols && container.querySelector('.photo-col')) {
    bindPhotoCardListeners();
    return;
  }
  currentGalleryCols = targetCols;

  // Carefully balanced distributions:
  // 3 Columns:
  // Col 1: Photo 0 (Silhouette Walk, 3:4), Photo 1 (Timex Archive, 21:9), Photo 4 (Solstice Sky, 4:3)
  // Col 2: Photo 2 (Morning Embrace, 3:4), Photo 3 (January Studies, 16:9), Photo 5 (Nocturnal Grid, 21:9)
  // Col 3: Photo 6 (Rooftop Quartet, 3:4), Photo 7 (Roofline Duo, 3:4)
  // 2 Columns (Tablet):
  // Col 1: Photos [0, 1, 2, 3]
  // Col 2: Photos [4, 5, 6, 7]
  // 1 Column (Mobile):
  // Col 1: Photos [0, 1, 2, 3, 4, 5, 6, 7]
  const distributions = {
    3: [
      [0, 1, 4],
      [2, 3, 5],
      [6, 7]
    ],
    2: [
      [0, 1, 2, 3],
      [4, 5, 6, 7]
    ],
    1: [
      [0, 1, 2, 3, 4, 5, 6, 7]
    ]
  };

  const colGroups = distributions[targetCols];

  function createCardHTML(p, idx) {
    const frameNum = String(idx + 1).padStart(2, '0');
    return `
      <article class="photo-card reveal" data-index="${idx}" tabindex="0" role="button" aria-label="View photograph: ${p.title}">
        <div class="photo-media">
          <img src="${p.src}" alt="${p.alt || p.title}" class="photo-img" loading="lazy" decoding="async">
          <div class="photo-overlay">
            <div class="photo-overlay-top">
              <span class="photo-frame-idx">${frameNum} // STILL</span>
              <span class="photo-aspect-badge">${p.aspectRatio || ''}</span>
            </div>
            <div class="photo-overlay-bottom">
              <h4 class="photo-overlay-title">${p.title}</h4>
              <p class="photo-overlay-cat">${p.category || ''}</p>
            </div>
            <div class="photo-zoom-icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  container.innerHTML = `
    <div class="photo-grid-columns cols-${targetCols}" id="photoGridColumns">
      ${colGroups.map((indices, colIdx) => `
        <div class="photo-col photo-col-${colIdx + 1}" data-col="${colIdx}">
          ${indices.map(i => createCardHTML(photos[i], i)).join('')}
        </div>
      `).join('')}
    </div>
  `;

  bindPhotoCardListeners();
  initScrollReveals();
}

function bindPhotoCardListeners() {
  const photoCards = document.querySelectorAll('.photo-card');
  photoCards.forEach((card) => {
    const idxAttr = card.getAttribute('data-index');
    const idx = parseInt(idxAttr, 10);
    if (!isNaN(idx)) {
      card.onclick = () => {
        if (typeof openPhotoLightboxFn === 'function') openPhotoLightboxFn(idx);
      };
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof openPhotoLightboxFn === 'function') openPhotoLightboxFn(idx);
        }
      };
    }
  });

  const aptiveCard = document.querySelector('.aptive-showcase-card');
  if (aptiveCard) {
    const idxAttr = aptiveCard.getAttribute('data-index');
    const idx = parseInt(idxAttr, 10);
    if (!isNaN(idx)) {
      aptiveCard.onclick = () => {
        if (typeof openPhotoLightboxFn === 'function') openPhotoLightboxFn(idx);
      };
      aptiveCard.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (typeof openPhotoLightboxFn === 'function') openPhotoLightboxFn(idx);
        }
      };
    }
  }
}

function initPhotoLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  const closeBtn = document.getElementById('photoLbClose');
  const prevBtn = document.getElementById('photoLbPrev');
  const nextBtn = document.getElementById('photoLbNext');
  const imgEl = document.getElementById('photoLbImg');
  const counterEl = document.getElementById('photoLbCounter');
  const titleEl = document.getElementById('photoLbTitle');
  const descEl = document.getElementById('photoLbDesc');
  const dimsEl = document.getElementById('photoLbDims');

  if (!lightbox || !closeBtn || !prevBtn || !nextBtn || !imgEl) return;

  const items = getAllPhotoItems();
  if (items.length === 0) return;

  function updateLightbox(index) {
    if (index < 0 || index >= items.length) return;
    currentPhotoIndex = index;
    const item = items[currentPhotoIndex];

    imgEl.classList.add('is-loading');

    const tempImg = new Image();
    tempImg.onload = () => {
      imgEl.src = item.src;
      imgEl.alt = item.alt || item.title;
      imgEl.classList.remove('is-loading');
    };
    tempImg.onerror = () => {
      imgEl.src = item.src;
      imgEl.alt = item.alt || item.title;
      imgEl.classList.remove('is-loading');
    };
    tempImg.src = item.src;

    if (counterEl) {
      const currentFormatted = String(currentPhotoIndex + 1).padStart(2, '0');
      const totalFormatted = String(items.length).padStart(2, '0');
      counterEl.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
    if (titleEl) titleEl.textContent = item.title;
    if (descEl) descEl.textContent = item.category || '';
    if (dimsEl) dimsEl.textContent = item.dimensions || '';

    // Preload adjacent frames
    const nextIdx = (currentPhotoIndex + 1) % items.length;
    const prevIdx = (currentPhotoIndex - 1 + items.length) % items.length;
    const preloadNext = new Image();
    preloadNext.src = items[nextIdx].src;
    const preloadPrev = new Image();
    preloadPrev.src = items[prevIdx].src;
  }

  function openLightbox(index) {
    lastActivePhotoTrigger = document.activeElement;
    updateLightbox(index);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    imgEl.src = '';
    if (lastActivePhotoTrigger && typeof lastActivePhotoTrigger.focus === 'function') {
      lastActivePhotoTrigger.focus();
    }
  }

  function navigate(dir) {
    const newIdx = (currentPhotoIndex + dir + items.length) % items.length;
    updateLightbox(newIdx);
  }

  // Register global opener for dynamic cards
  openPhotoLightboxFn = openLightbox;

  // Bind clicks and keyboard interactions to photo cards
  bindPhotoCardListeners();

  // Lightbox Navigation Buttons
  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigate(-1);
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navigate(1);
  });

  // Backdrop click closes lightbox
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('photo-lb-stage')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      navigate(1);
    } else if (e.key === 'ArrowLeft') {
      navigate(-1);
    }
  });

  // Touch swipe support for mobile viewports
  let touchStartX = 0;
  let touchEndX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff < 0) {
        navigate(1); // Swipe left -> Next
      } else {
        navigate(-1); // Swipe right -> Previous
      }
    }
  }, { passive: true });

  // Debounced resize handler for responsive column reorganization
  let galleryResizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(galleryResizeTimer);
    galleryResizeTimer = setTimeout(() => {
      renderPhotoGallery();
    }, 120);
  }, { passive: true });
}

/* -------------------------------------------------------------------------- */
/* 3. DESKTOP CUSTOM CURSOR                                                   */
/* -------------------------------------------------------------------------- */

function initCustomCursor() {
  const cur = document.getElementById('cur');
  const ring = document.getElementById('ring');
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isTouch || prefersReduced || !cur || !ring) return;

  document.body.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cur.style.left = `${mouseX}px`;
    cur.style.top = `${mouseY}px`;
  }, { passive: true });

  // Fluid physics ring lerp
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hover scale states
  const interactiveSelectors = 'a, button, .work-card, input, select, textarea, [tabindex="0"]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cur.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      cur.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 4. NAVIGATION & SCROLLSPY                                                  */
/* -------------------------------------------------------------------------- */

function initNavigation() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Navbar blur background
    if (nav) {
      if (scrollPos > 40) {
        nav.classList.add('stuck');
      } else {
        nav.classList.remove('stuck');
      }
    }

    // Scrollspy active state
    let currentSectionId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}` || ((currentSectionId === 'home' || !currentSectionId) && link.getAttribute('href') === '#about')) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  // Smooth Back-to-Top Button
  const topBtn = document.getElementById('backToTopBtn');
  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* -------------------------------------------------------------------------- */
/* 5. MOBILE DRAWER NAVIGATION                                                */
/* -------------------------------------------------------------------------- */

function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!hamburger || !mobileMenu) return;

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 6. SCROLL REVEAL OBSERVER                                                  */
/* -------------------------------------------------------------------------- */

function initScrollReveals() {
  const elements = document.querySelectorAll('.reveal:not(.is-revealed)');
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* -------------------------------------------------------------------------- */
/* 7. COPY EMAIL TO CLIPBOARD                                                 */
/* -------------------------------------------------------------------------- */

function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = (PORTFOLIO_CONFIG.author && PORTFOLIO_CONFIG.author.email) 
      ? PORTFOLIO_CONFIG.author.email 
      : 'vamsi13864@gmail.com';

    const showSuccess = () => {
      const originalText = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        COPIED TO CLIPBOARD!
      `;
      copyBtn.style.background = '#ffffff';
      copyBtn.style.color = '#000000';

      setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = '';
        copyBtn.style.color = '';
      }, 2400);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email)
        .then(showSuccess)
        .catch(() => {
          fallbackClipboardCopy(email);
          showSuccess();
        });
    } else {
      fallbackClipboardCopy(email);
      showSuccess();
    }
  });
}

function fallbackClipboardCopy(text) {
  const tempInput = document.createElement('textarea');
  tempInput.value = text;
  tempInput.style.position = 'fixed';
  tempInput.style.left = '-9999px';
  tempInput.style.top = '-9999px';
  document.body.appendChild(tempInput);
  tempInput.focus();
  tempInput.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.warn('Fallback clipboard copy failed:', err);
  }
  document.body.removeChild(tempInput);
}

/* -------------------------------------------------------------------------- */
/* 8. LIVE FOOTER TIMECODE CLOCK                                              */
/* -------------------------------------------------------------------------- */

function initLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    clockEl.textContent = `${timeStr} UTC • 24 FPS TIMELINE`;
  }

  update();
  setInterval(update, 1000);
}
