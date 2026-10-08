'use strict';

const { lang, t, catalog } = JSON.parse(document.querySelector('#site-data').textContent);
try { localStorage.setItem('lc-lang', lang); } catch {}

document.querySelectorAll('.languages a').forEach(link => {
  link.addEventListener('click', () => {
    link.hash = location.hash;
    if (!link.hasAttribute('aria-current')) link.classList.add('switching');
  });
});

const dialog = document.querySelector('dialog');
const image = document.getElementById('detail-image');
const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;
let active = null;
let opener = null;
const el = id => document.getElementById(id);

const setDialogState = open => {
  if (document.body?.classList) document.body.classList.toggle('dialog-open', open);
};

const changeView = view => {
  if (!active) return;
  image.onload = () => {
    if (!reducedMotion && image.animate) {
      image.animate([{ opacity: .72, transform: 'scale(.985)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 180, easing: 'ease-out' });
    }
  };
  image.src = '../' + (view === 'general' ? active.imagen_web : active.recorte);
  image.alt = `${t.imageAlt} ${active.descripcion_literal} · ${view === 'general' ? t.general : t.zoom}`;
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
};

const openDetail = button => {
  active = catalog[Number(button.dataset.open)];
  opener = button;
  el('detail-name').textContent = active.nombre_comercial;
  el('detail-price').textContent = 'US$' + active.precio_usd;
  el('detail-descriptor').textContent = active.descripcion_literal;
  el('detail-desc').textContent = active.descripcion_comercial;
  el('detail-state').textContent = active.modalidad === 'preorden' ? t.preorder : '';
  el('detail-note').textContent = active.modalidad === 'preorden' ? t.preorderNote : t.availability;
  changeView('general');
  dialog.showModal();
  setDialogState(true);
};

document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openDetail(button)));
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const r = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close();
});
dialog.addEventListener('close', () => {
  setDialogState(false);
  opener?.focus();
});
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => changeView(button.dataset.view)));

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrived');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });
  document.body.classList.add('js-motion');
  document.querySelectorAll('.story-card').forEach(item => observer.observe(item));
}

// A compact Instagram shortcut appears only after leaving the first screen.
if ('IntersectionObserver' in window) {
  const hero = document.querySelector('.hero');
  if (hero) {
    const shortcutObserver = new IntersectionObserver(entries => {
      document.body.classList.toggle('show-floating-ig', !entries[0].isIntersecting);
    }, { threshold: 0 });
    shortcutObserver.observe(hero);
  }
}
