/* Firebase se carga de forma diferida cuando el portafolio entra en viewport */
let _db, _doc, _getDoc;

async function initFirebase() {
  if (_db) return;
  const [{ initializeApp }, { getFirestore, doc, getDoc }] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js'),
  ]);
  const app = initializeApp({
    apiKey:            "AIzaSyDlGagOQXCVGB-Z7TYR859YFBO2juaO_N4",
    authDomain:        "anafotos-f945f.firebaseapp.com",
    projectId:         "anafotos-f945f",
    messagingSenderId: "879604780673",
    appId:             "1:879604780673:web:abd355e474b448ff884780"
  });
  _db = getFirestore(app);
  _doc = doc;
  _getDoc = getDoc;
}

/* =============================================
   AS CONTENT MEDIA — main.js
   ============================================= */

/* ---- Navigation ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- Mobile menu ---- */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---- Scroll reveal ---- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = entry.target.dataset.delay || 0;
    setTimeout(() => entry.target.classList.add('in'), Number(delay));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// Stagger solo dentro de grillas (efecto cascada visual)
document.querySelectorAll('.services__grid, .portfolio__grid').forEach(grid => {
  [...grid.querySelectorAll('.reveal')].forEach((el, i) => {
    el.dataset.delay = i * 80;
  });
});

// Hero immediate reveal
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 180 + i * 160);
  });
});

/* =============================================
   EVENT METADATA
   ============================================= */
const eventMeta = {
  bodas:          { title: 'Bodas' },
  'baby-shower':  { title: 'Baby Shower' },
  cumpleanos:     { title: 'Cumpleaños' },
  'bridal-shower':{ title: 'Bridal Shower' },
  bautizo:        { title: 'Bautizo' },
  deportes:       { title: 'Deportes' },
  festivales:     { title: 'Festivales' },
  eventos:        { title: 'Eventos' },
};

/* =============================================
   PORTFOLIO COVERS — cargar desde Firestore
   ============================================= */
async function loadCovers() {
  await initFirebase();
  const cards = document.querySelectorAll('.port-card');
  await Promise.all([...cards].map(async card => {
    const key = card.dataset.event;
    try {
      const snap = await _getDoc(_doc(_db, 'portafolio', key));
      if (!snap.exists()) return;
      const cover = snap.data().cover;
      if (!cover) return;
      const placeholder = card.querySelector('.port-card__placeholder');
      if (!placeholder) return;
      const img = document.createElement('img');
      img.src = cover.type === 'video' && cover.thumb ? cover.thumb : cover.url;
      img.alt = `Portafolio de ${eventMeta[key]?.title || key} — AS Content Media Sonora`;
      img.loading = 'lazy';
      img.className = 'port-card__cover-img';
      placeholder.replaceWith(img);
    } catch { /* sin portada, muestra placeholder */ }
  }));
}

/* Cargar Firebase solo cuando el portafolio entra en viewport */
const portfolioSection = document.getElementById('portafolio');
if (portfolioSection) {
  const portfolioObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      portfolioObserver.disconnect();
      loadCovers();
    }
  }, { rootMargin: '200px' });
  portfolioObserver.observe(portfolioSection);
} else {
  loadCovers();
}

/* =============================================
   3D TILT EFFECT
   ============================================= */
document.querySelectorAll('.port-card').forEach(card => {
  let rafId = null;
  let pendingX = 0, pendingY = 0;
  const rect = { left: 0, top: 0, width: 1, height: 1 };

  card.addEventListener('mouseenter', () => {
    const r = card.getBoundingClientRect();
    rect.left = r.left; rect.top = r.top; rect.width = r.width; rect.height = r.height;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.4s, border-color 0.4s';
  });

  card.addEventListener('mousemove', e => {
    pendingX = (e.clientX - rect.left) / rect.width  - 0.5;
    pendingY = (e.clientY - rect.top)  / rect.height - 0.5;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      card.style.transform = `perspective(700px) rotateY(${pendingX * 14}deg) rotateX(${-pendingY * 14}deg) scale(1.03) translateZ(10px)`;
      rafId = null;
    });
  });

  card.addEventListener('mouseleave', () => {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s, border-color 0.4s';
    card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) scale(1) translateZ(0)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* =============================================
   MODAL
   ============================================= */
/* =============================================
   LIGHTBOX
   ============================================= */
const lightbox        = document.getElementById('lightbox');
const lightboxMedia   = document.getElementById('lightboxMedia');
const lightboxClose   = document.getElementById('lightboxClose');
const lightboxPrev    = document.getElementById('lightboxPrev');
const lightboxNext    = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let lbItems  = []; // array of item objects currently in gallery
let lbIndex  = 0;

function openLightbox(items, index) {
  lbItems = items;
  lbIndex = index;
  renderLightboxItem();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxMedia.innerHTML = '';
  // Restore modal scroll
  document.body.style.overflow = 'hidden'; // modal still open
}

function renderLightboxItem() {
  lightboxMedia.innerHTML = '';
  const item = lbItems[lbIndex];
  if (!item) return;

  if (item.type === 'video') {
    const video = document.createElement('video');
    video.src = item.url;
    video.controls = true;
    video.autoplay = true;
    lightboxMedia.appendChild(video);
  } else if (item.url) {
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = `Fotografía de ${modalTitle.textContent || 'evento'} — AS Content Media`;
    lightboxMedia.appendChild(img);
  }

  lightboxCounter.textContent = `${lbIndex + 1} / ${lbItems.length}`;
  lightboxPrev.classList.toggle('hidden', lbIndex === 0);
  lightboxNext.classList.toggle('hidden', lbIndex === lbItems.length - 1);
}

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => { if (lbIndex > 0) { lbIndex--; renderLightboxItem(); } });
lightboxNext.addEventListener('click', () => { if (lbIndex < lbItems.length - 1) { lbIndex++; renderLightboxItem(); } });

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { if (lbIndex > 0) { lbIndex--; renderLightboxItem(); } }
  if (e.key === 'ArrowRight') { if (lbIndex < lbItems.length - 1) { lbIndex++; renderLightboxItem(); } }
  if (e.key === 'Escape') closeLightbox();
});

/* =============================================
   MODAL
   ============================================= */
const modal    = document.getElementById('galleryModal');
const backdrop = document.getElementById('modalBackdrop');
const modalTitle  = document.getElementById('modalTitle');
const modalNote   = document.getElementById('modalNote');
const modalGrid   = document.getElementById('modalGrid');
const modalClose  = document.getElementById('modalClose');

const cameraIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>`;

const videoIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>`;

function buildGalleryItem(item, realItems = [], realIndex = -1) {
  const div = document.createElement('div');
  div.className = 'gallery-item' + (item.type === 'video' ? ' gallery-item--video' : '');

  if (item.url) {
    if (item.type === 'video' && item.thumb) {
      const img = document.createElement('img');
      img.src = item.thumb;
      img.alt = `Video de ${modalTitle.textContent || 'evento'} — AS Content Media`;
      img.loading = 'lazy';
      div.appendChild(img);
      const play = document.createElement('div');
      play.className = 'gallery-item__play';
      play.innerHTML = `<svg viewBox="0 0 24 24" fill="rgba(244,239,233,0.85)" width="44" height="44"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      div.appendChild(play);
    } else if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.url;
      video.preload = 'metadata';
      video.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      div.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = `Fotografía de ${modalTitle.textContent || 'evento'} — AS Content Media`;
      img.loading = 'lazy';
      div.appendChild(img);
    }

    // Click abre lightbox
    if (realItems.length > 0 && realIndex >= 0) {
      div.addEventListener('click', () => openLightbox(realItems, realIndex));
    }
  } else {
    const ph = document.createElement('div');
    ph.className = 'gallery-ph';
    ph.innerHTML = item.type === 'video'
      ? videoIcon + '<span>Video próximamente</span>'
      : cameraIcon + '<span>Foto próximamente</span>';
    div.appendChild(ph);
  }

  return div;
}

const placeholderItems = [
  { type: 'image' }, { type: 'image' }, { type: 'video' },
  { type: 'image' }, { type: 'image' }, { type: 'image' },
];

let currentGalleryItems = [];

async function openModal(key) {
  const meta = eventMeta[key];
  if (!meta) return;

  modalTitle.textContent = meta.title;
  modalGrid.innerHTML = '<div class="gallery-loading">Cargando...</div>';
  if (modalNote) modalNote.style.display = 'none';
  currentGalleryItems = [];

  modal.classList.add('open');
  backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();

  try {
    await initFirebase();
    const snap = await _getDoc(_doc(_db, 'portafolio', key));
    const items = snap.exists() ? (snap.data().items || []) : [];

    modalGrid.innerHTML = '';

    if (items.length === 0) {
      if (modalNote) modalNote.style.display = '';
      placeholderItems.forEach(item => modalGrid.appendChild(buildGalleryItem(item, [])));
    } else {
      currentGalleryItems = items.filter(i => i.url);
      items.forEach((item, i) => modalGrid.appendChild(buildGalleryItem(item, currentGalleryItems, i)));
    }
  } catch (e) {
    modalGrid.innerHTML = '';
    if (modalNote) modalNote.style.display = '';
    placeholderItems.forEach(item => modalGrid.appendChild(buildGalleryItem(item, [])));
  }
}

function closeModal() {
  modal.classList.remove('open');
  backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.port-card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.event));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card.dataset.event); }
  });
});

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
