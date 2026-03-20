import { db, auth } from './firebase-config.js';
import {
  doc, getDoc, setDoc
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js';

/* =============================================
   CLOUDINARY CONFIG
   Llena estos dos valores con los tuyos
   ============================================= */
const CLOUDINARY_CLOUD  = 'dxvmswmpn';
const CLOUDINARY_PRESET = 'anasofia';

/* ---- Event metadata ---- */
const eventMeta = {
  bodas:           { title: 'Bodas' },
  'baby-shower':   { title: 'Baby Shower' },
  cumpleanos:      { title: 'Cumpleaños' },
  'bridal-shower': { title: 'Bridal Shower' },
  bautizo:         { title: 'Bautizo' },
  deportes:        { title: 'Deportes' },
  festivales:      { title: 'Festivales' },
  eventos:         { title: 'Eventos' },
};

/* ---- State ---- */
let currentEvent      = 'bodas';
let currentCover      = null;
let pendingDeleteItem = null;

/* ---- DOM ---- */
const loginScreen     = document.getElementById('loginScreen');
const dashboard       = document.getElementById('dashboard');
const loginForm       = document.getElementById('loginForm');
const loginEmail      = document.getElementById('loginEmail');
const loginPass       = document.getElementById('loginPass');
const loginError      = document.getElementById('loginError');
const loginBtn        = document.getElementById('loginBtn');
const logoutBtn       = document.getElementById('logoutBtn');
const contentTitle    = document.getElementById('contentTitle');
const contentCount    = document.getElementById('contentCount');
const uploadZone      = document.getElementById('uploadZone');
const uploadQueue     = document.getElementById('uploadQueue');
const fileInput       = document.getElementById('fileInput');
const browseBtn       = document.getElementById('browseBtn');
const mediaGrid       = document.getElementById('mediaGrid');
const confirmBackdrop = document.getElementById('confirmBackdrop');
const confirmDialog   = document.getElementById('confirmDialog');
const confirmOk       = document.getElementById('confirmOk');
const confirmCancel   = document.getElementById('confirmCancel');

/* =============================================
   AUTH
   ============================================= */
onAuthStateChanged(auth, user => {
  if (user) {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadCurrentEvent();
  } else {
    loginScreen.classList.remove('hidden');
    dashboard.classList.add('hidden');
  }
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginError.textContent = '';
  loginBtn.disabled = true;
  loginBtn.textContent = 'Entrando...';
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value.trim(), loginPass.value);
  } catch {
    loginError.textContent = 'Correo o contraseña incorrectos.';
    loginBtn.disabled = false;
    loginBtn.textContent = 'Entrar';
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

/* =============================================
   SIDEBAR NAV
   ============================================= */
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentEvent = btn.dataset.event;
    loadCurrentEvent();
  });
});

function loadCurrentEvent() {
  contentTitle.textContent = eventMeta[currentEvent].title;
  uploadQueue.innerHTML = '';
  loadMediaGrid();
}

/* =============================================
   FIRESTORE HELPERS
   ============================================= */
async function getItems(eventKey) {
  const snap = await getDoc(doc(db, 'portafolio', eventKey));
  return snap.exists() ? (snap.data().items || []) : [];
}

async function saveItems(eventKey, items) {
  await setDoc(doc(db, 'portafolio', eventKey), { items });
}

async function addItem(eventKey, item) {
  const items = await getItems(eventKey);
  items.push(item);
  await saveItems(eventKey, items);
}

async function removeItem(eventKey, itemId) {
  const snap = await getDoc(doc(db, 'portafolio', eventKey));
  const data = snap.exists() ? snap.data() : {};
  const items = (data.items || []).filter(i => i.id !== itemId);
  const cover = data.cover?.id === itemId ? null : (data.cover || null);
  await setDoc(doc(db, 'portafolio', eventKey), { items, ...(cover ? { cover } : {}) });
}

async function setCover(item) {
  const cover = {
    id:   item.id,
    type: item.type,
    url:  item.url,
    ...(item.thumb && { thumb: item.thumb }),
  };
  const snap = await getDoc(doc(db, 'portafolio', currentEvent));
  const data = snap.exists() ? snap.data() : {};
  await setDoc(doc(db, 'portafolio', currentEvent), { ...data, cover });
  currentCover = cover;
  loadMediaGrid();
}

/* =============================================
   MEDIA GRID
   ============================================= */
async function loadMediaGrid() {
  mediaGrid.innerHTML = '<div class="media-loading"><span>Cargando...</span></div>';
  try {
    const snap = await getDoc(doc(db, 'portafolio', currentEvent));
    const data = snap.exists() ? snap.data() : {};
    currentCover = data.cover || null;
    renderGrid(data.items || []);
  } catch {
    mediaGrid.innerHTML = '<div class="media-loading"><span>Error al cargar.</span></div>';
  }
}

function renderGrid(items) {
  mediaGrid.innerHTML = '';
  if (items.length === 0) {
    mediaGrid.innerHTML = `<div class="media-empty"><p>No hay archivos aún.<br>Sube fotos o videos desde el área de arriba.</p></div>`;
    contentCount.textContent = '0 archivos';
    return;
  }
  contentCount.textContent = `${items.length} archivo${items.length !== 1 ? 's' : ''}`;
  items.forEach(item => mediaGrid.appendChild(buildMediaItem(item)));
}

function buildMediaItem(item) {
  const div = document.createElement('div');
  div.className = 'media-item';

  const typeLabel = document.createElement('span');
  typeLabel.className = 'media-item__type';
  typeLabel.textContent = item.type === 'video' ? 'Video' : 'Foto';
  div.appendChild(typeLabel);

  if (item.type === 'video') {
    const img = document.createElement('img');
    img.src = item.thumb;
    img.alt = item.name || '';
    img.loading = 'lazy';
    div.appendChild(img);

    const playDiv = document.createElement('div');
    playDiv.className = 'media-item__play';
    playDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
    div.appendChild(playDiv);
  } else {
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.name || '';
    img.loading = 'lazy';
    div.appendChild(img);
  }

  // Cover badge
  const isCover = currentCover && currentCover.id === item.id;
  if (isCover) {
    const badge = document.createElement('div');
    badge.className = 'media-item__cover-badge';
    badge.textContent = 'Portada';
    div.appendChild(badge);
  }

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'media-item__overlay';

  // Set cover button
  const coverBtn = document.createElement('button');
  coverBtn.className = 'media-item__set-cover' + (isCover ? ' is-cover' : '');
  coverBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="${isCover ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" width="14" height="14"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${isCover ? 'Portada actual' : 'Usar como portada'}`;
  if (!isCover) coverBtn.addEventListener('click', e => { e.stopPropagation(); setCover(item); });
  else coverBtn.disabled = true;
  overlay.appendChild(coverBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'media-item__delete';
  deleteBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14H6L5 6"/>
      <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
    </svg>
    Eliminar`;
  deleteBtn.addEventListener('click', e => { e.stopPropagation(); openConfirm(item); });
  overlay.appendChild(deleteBtn);
  div.appendChild(overlay);

  return div;
}

/* =============================================
   CONFIRM DELETE
   ============================================= */
function openConfirm(item) {
  pendingDeleteItem = item;
  confirmBackdrop.classList.add('open');
  confirmDialog.classList.add('open');
}
function closeConfirm() {
  pendingDeleteItem = null;
  confirmBackdrop.classList.remove('open');
  confirmDialog.classList.remove('open');
}

confirmCancel.addEventListener('click', closeConfirm);
confirmBackdrop.addEventListener('click', closeConfirm);

confirmOk.addEventListener('click', async () => {
  if (!pendingDeleteItem) return;
  const item = pendingDeleteItem;
  closeConfirm();
  try {
    await removeItem(currentEvent, item.id);
    loadMediaGrid();
  } catch (e) {
    console.error('Error al eliminar:', e);
  }
});

/* =============================================
   UPLOAD ZONE
   ============================================= */
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => { handleFiles(fileInput.files); fileInput.value = ''; });

uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

// Encadenamos las subidas para evitar condición de carrera en Firestore
let uploadChain = Promise.resolve();

function handleFiles(files) {
  if (!files || files.length === 0) return;
  [...files].forEach(file => {
    uploadChain = uploadChain.then(() => uploadFile(file));
  });
}

/* =============================================
   CLOUDINARY UPLOAD
   ============================================= */
async function uploadFile(file) {
  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) return;

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const resourceType = isVideo ? 'video' : 'image';
  const apiUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/${resourceType}/upload`;

  // Add queue item
  const queueItem = createQueueItem(file, isVideo);
  uploadQueue.appendChild(queueItem);
  const progressBar = queueItem.querySelector('.queue-item__progress');
  const statusEl   = queueItem.querySelector('.queue-item__status');

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', `portafolio/${currentEvent}`);
    formData.append('public_id', id);

    // XHR para progreso
    const result = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl);
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          const pct = Math.round(e.loaded / e.total * 100);
          progressBar.style.width = pct + '%';
          statusEl.textContent = `Subiendo... ${pct}%`;
        }
      });
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) resolve(JSON.parse(xhr.responseText));
        else reject(new Error(xhr.responseText));
      });
      xhr.addEventListener('error', () => reject(new Error('Error de red')));
      xhr.send(formData);
    });

    // Cloudinary genera thumbnails de video automáticamente
    const thumbUrl = isVideo
      ? result.secure_url.replace('/video/upload/', '/video/upload/so_2,w_800,c_fill,q_auto/').replace(/\.(mp4|mov|avi|webm)$/i, '.jpg')
      : null;

    const item = {
      id,
      type: isVideo ? 'video' : 'image',
      url: result.secure_url,
      name: file.name,
      uploadedAt: new Date().toISOString(),
      ...(thumbUrl && { thumb: thumbUrl }),
    };

    await addItem(currentEvent, item);

    statusEl.textContent = 'Listo';
    statusEl.classList.add('done');
    progressBar.style.width = '100%';
    loadMediaGrid();
    setTimeout(() => queueItem.remove(), 2000);

  } catch (err) {
    console.error('Error al subir:', err);
    statusEl.textContent = 'Error al subir';
    statusEl.classList.add('error');
    progressBar.style.background = '#e74c3c';
  }
}

/* =============================================
   QUEUE ITEM UI
   ============================================= */
function createQueueItem(file, isVideo) {
  const div = document.createElement('div');
  div.className = 'queue-item';

  const thumbDiv = document.createElement('div');
  thumbDiv.className = 'queue-item__thumb';

  if (isVideo) {
    thumbDiv.classList.add('queue-item__thumb--video');
    thumbDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`;
  } else {
    const img = document.createElement('img');
    const url = URL.createObjectURL(file);
    img.src = url;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    img.onload = () => URL.revokeObjectURL(url);
    thumbDiv.appendChild(img);
  }

  const infoDiv = document.createElement('div');
  infoDiv.className = 'queue-item__info';
  infoDiv.innerHTML = `
    <div class="queue-item__name">${file.name}</div>
    <div class="queue-item__bar"><div class="queue-item__progress"></div></div>
    <div class="queue-item__status">Preparando...</div>`;

  div.appendChild(thumbDiv);
  div.appendChild(infoDiv);
  return div;
}
