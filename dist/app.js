const siteData = JSON.parse(document.querySelector('#site-data')?.textContent || '{}');
const catalog = siteData.catalog || [];
const t = siteData.t || {};
const dialog = document.querySelector('#piece-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogName = document.querySelector('#dialog-name');
const dialogLiteral = document.querySelector('#dialog-literal');
const dialogDescription = document.querySelector('#dialog-description');
const dialogPrice = document.querySelector('#dialog-price');
const dialogState = document.querySelector('#dialog-state');
const dialogFocus = document.querySelector('#dialog-focus');
const dialogNote = document.querySelector('#dialog-note');
const closeDialog = document.querySelector('.dialog-close');
const openers = [...document.querySelectorAll('[data-open]')];
const switchers = [...document.querySelectorAll('[data-view]')];
const langLinks = [...document.querySelectorAll('.lang-switch a')];
const floating = document.querySelector('.floating-ig');
let currentIndex = 0;
let currentView = 'image';
let currentTrigger = null;

function updateView(view) {
  const piece = catalog[currentIndex];
  currentView = view;
  if (!piece) return;
  dialogImage.src = `../${view === 'closeup' ? piece.close : piece.image}`;
  dialogImage.alt = `${t.imageAlt || 'Photograph of'} ${piece.name}`;
  switchers.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
}

function openPiece(index, trigger) {
  const piece = catalog[index];
  if (!piece) return;
  currentIndex = index;
  currentTrigger = trigger || null;
  dialogName.textContent = piece.name;
  dialogLiteral.textContent = piece.literal;
  dialogDescription.textContent = piece.description;
  dialogPrice.textContent = piece.price;
  dialogState.textContent = piece.state || '';
  dialogFocus.textContent = piece.focus;
  dialogNote.textContent = piece.state ? t.preorderNote : t.availability;
  updateView('image');
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
}

openers.forEach((opener) => {
  opener.addEventListener('click', () => openPiece(Number(opener.dataset.open), opener));
});

switchers.forEach((button) => button.addEventListener('click', () => updateView(button.dataset.view)));
closeDialog?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
dialog?.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  currentTrigger?.focus?.();
});

document.addEventListener('keydown', (event) => {
  if (!dialog?.open) return;
  if (event.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % catalog.length;
    openPiece(currentIndex, currentTrigger);
  }
  if (event.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + catalog.length) % catalog.length;
    openPiece(currentIndex, currentTrigger);
  }
});

langLinks.forEach((link) => link.addEventListener('click', () => {
  localStorage.setItem('lc_lang', link.lang);
}));

const reveals = [...document.querySelectorAll('[data-reveal]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8%' });
  reveals.forEach((item, index) => {
    item.style.setProperty('--delay', `${(index % 6) * 70}ms`);
    observer.observe(item);
  });
} else {
  reveals.forEach((item) => item.classList.add('visible'));
}

const hero = document.querySelector('.hero');
if (hero && floating && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => document.body.classList.toggle('show-floating', !entry.isIntersecting));
  }, { threshold: 0.1 });
  observer.observe(hero);
}

if (!reduceMotion) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 6;
      const ry = (x - 0.5) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}
