import { mkdir, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const catalog = JSON.parse(await readFile(path.join(root, 'src/catalog.json'), 'utf8'));
const locales = JSON.parse(await readFile(path.join(root, 'src/locales.json'), 'utf8'));
const instagram = 'https://www.instagram.com/luzcelestia.ni/';

await mkdir(dist, { recursive: true });
await writeFile(path.join(dist, 'style.css'), await readFile(path.join(root, 'src/style.css')));
await writeFile(path.join(dist, 'app.js'), await readFile(path.join(root, 'src/app.js')));
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true, force: true });

const esc = (s='') => String(s)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

const signet = '<span class="celestia-signet" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v12M8 6h8"/><path d="M12 21s-5.5-3.1-5.5-6.3A3.1 3.1 0 0 1 12 12.9a3.1 3.1 0 0 1 5.5 1.8C17.5 17.9 12 21 12 21Z"/></svg></span>';

const icons = {
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h11.17l-4.59 4.59L13 18l7-7-7-7-1.42 1.41L16.17 10H5v2Z" fill="currentColor"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" fill="currentColor"/></svg>',
  cross: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v5h5v6h-5v7H9v-7H4V8h5z" fill="currentColor"/></svg>',
  heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21 3.8 13.8A5.5 5.5 0 0 1 11 5.63 5.5 5.5 0 0 1 20.2 13.8L12 21Z" fill="currentColor"/></svg>',
  insta: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.7 2h8.6A5.7 5.7 0 0 1 22 7.7v8.6a5.7 5.7 0 0 1-5.7 5.7H7.7A5.7 5.7 0 0 1 2 16.3V7.7A5.7 5.7 0 0 1 7.7 2Zm0 1.8A3.9 3.9 0 0 0 3.8 7.7v8.6a3.9 3.9 0 0 0 3.9 3.9h8.6a3.9 3.9 0 0 0 3.9-3.9V7.7a3.9 3.9 0 0 0-3.9-3.9H7.7Zm8.9 1.3a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z" fill="currentColor"/></svg>',
  ribbon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16l-4 8 4 8H4l4-8-4-8Z" fill="currentColor"/></svg>',
  shell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c4.08 0 7 2.52 7 6.4 0 5.06-3.77 9.27-7 11.6-3.23-2.33-7-6.54-7-11.6C5 5.52 7.92 3 12 3Zm0 2c-2.86 0-5 1.63-5 4.4 0 3.81 2.74 7.31 5 9.22 2.26-1.91 5-5.41 5-9.22C17 6.63 14.86 5 12 5Zm0 1.5c1.86 0 3 1.2 3 2.9v2.6c0 1.89-1.05 3.22-3 4.54-1.95-1.32-3-2.65-3-4.54V9.4c0-1.7 1.14-2.9 3-2.9Z" fill="currentColor"/></svg>'
};

function productCard(product, i, lang, t){
  const name = product[`nombre_comercial_${lang}`];
  return `
    <article class="piece-card piece-${i+1}" data-reveal data-tilt>
      <button type="button" class="piece-visual" data-open="${i}" aria-label="${esc(t.detailButton)}: ${esc(name)}">
        <div class="piece-figure">
          <img src="../${product.imagen_web}" alt="${esc(t.imageAlt)} ${esc(name)}" loading="lazy" decoding="async">
        </div>
        <div class="piece-closeup">
          <img src="../${product.recortes_autenticos[1]}" alt="${esc(t.imageAlt)} ${esc(name)} close detail" loading="lazy" decoding="async">
        </div>
        <span class="view-tag">${icons.plus}<span>${esc(t.detailButton)}</span></span>
      </button>
      <div class="piece-copy">
        <div class="piece-topline">
          <span class="piece-number">0${i+1}</span>
          ${product.modalidad === 'preorden' ? `<span class="piece-state">${esc(t.preorder)}</span>` : ''}
        </div>
        <div class="piece-head">
          <h3>${esc(name)}</h3>
          <strong>US$${product.precio_usd}</strong>
        </div>
        <p class="piece-literal">${esc(product[`descripcion_literal_${lang}`])}</p>
        <p class="piece-desc">${esc(product[`descripcion_comercial_${lang}`])}</p>
        <div class="piece-focus"><span><i class="detail-spark" aria-hidden="true">✦</i>${esc(t.focusLabel)}</span><b>${esc(product[`detalle_foco_${lang}`])}</b></div>
        <div class="piece-links">
          <button type="button" class="inline-link" data-open="${i}">${esc(t.detailButton)} ${icons.arrow}</button>
          <a class="inline-link" href="${instagram}" target="_blank" rel="noopener noreferrer">Instagram ${icons.arrow}</a>
        </div>
      </div>
    </article>`;
}

function page(lang){
  const t = locales[lang];
  const current = (code) => lang === code ? ' aria-current="page"' : '';
  const cards = catalog.map((p,i)=>productCard(p,i,lang,t)).join('');
  const json = {
    lang, instagram, t,
    catalog: catalog.map(p => ({
      name: p[`nombre_comercial_${lang}`],
      literal: p[`descripcion_literal_${lang}`],
      description: p[`descripcion_comercial_${lang}`],
      focus: p[`detalle_foco_${lang}`],
      state: p.modalidad === 'preorden' ? t.preorder : '',
      price: `US$${p.precio_usd}`,
      image: p.imagen_web,
      close: p.recortes_autenticos[1]
    }))
  };

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.meta)}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.meta)}">
<meta property="og:image" content="../assets/productos/editorial-v7/social_cover.webp">
<meta property="og:type" content="website">
<meta name="theme-color" content="#103e46">
<link rel="icon" href="../assets/logo/favicon.png">
<link rel="stylesheet" href="../style.css">
</head>
<body>
<a class="skip-link" href="#main">${esc(t.skip)}</a>
<header class="site-header" id="top">
  <div class="header-wrap">
    <a class="brand" href="#top"><img src="../assets/logo/logo_contraste_transparente.png" alt="Luz Celestia"></a>
    <nav class="main-nav" aria-label="Main navigation">
      <a href="#collection">${esc(t.navCollection)}</a>
      <a href="#focus">${esc(t.navFocus)}</a>
      <a href="#order">${esc(t.navOrder)}</a>
    </nav>
    <div class="header-actions">
      <a class="header-ig" href="${instagram}" target="_blank" rel="noopener noreferrer">${icons.insta}<span>${esc(t.navInstagram)}</span></a>
      <div class="lang-switch" aria-label="${esc(t.langLabel)}">
        <a href="../en/" lang="en"${current('en')}>EN</a>
        <a href="../es/" lang="es"${current('es')}>ES</a>
      </div>
    </div>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="hero-grid">
      <div class="hero-copy" data-reveal>
        <div class="section-kicker">${signet}<span>${esc(t.heroEyebrow)}</span></div>
        <h1><span>${esc(t.heroTitleA)}</span><em>${esc(t.heroTitleB)}</em></h1>
        <p class="hero-body">${esc(t.heroBody)}</p>
        <div class="hero-buttons">
          <a class="btn btn-primary" href="#collection">${esc(t.heroPrimary)} ${icons.arrow}</a>
          <a class="btn btn-secondary" href="${instagram}" target="_blank" rel="noopener noreferrer">${esc(t.heroSecondary)} ${icons.arrow}</a>
        </div>
        <div class="hero-badges">
          <span>${esc(t.heroBadgeA)}</span>
          <span>${esc(t.heroBadgeB)}</span>
          <span>${esc(t.heroBadgeC)}</span>
        </div>
      </div>

      <div class="hero-stage" data-reveal>
        <div class="hero-campaign-image"><img src="../assets/productos/campaign-v10/hero_originals_campaign.webp" width="1800" height="1350" alt="Real Luz Celestia pieces: pink ribbon bracelet, heart crosses and shell ribbons" loading="eager" fetchpriority="high"></div>
        <div class="hero-note">
          <strong>${esc(t.heroCalloutTitle)}</strong>
          <p>${esc(t.heroCalloutText)}</p>
        </div>
      </div>
    </div>
    <div class="hero-strip" aria-hidden="true">
      <span>${icons.cross}${esc(t.heroStrip1)}</span>
      <span>${icons.ribbon}${esc(t.heroStrip2)}</span>
      <span>${icons.heart}${esc(t.heroStrip3)}</span>
      <span>${icons.shell}${esc(t.heroStrip4)}</span>
      <span>${icons.cross}${esc(t.heroStrip1)}</span>
      <span>${icons.ribbon}${esc(t.heroStrip2)}</span>
      <span>${icons.heart}${esc(t.heroStrip3)}</span>
      <span>${icons.shell}${esc(t.heroStrip4)}</span>
    </div>
  </section>

  <section class="collection" id="collection">
    <div class="section-head" data-reveal>
      <div>
        <div class="section-kicker">${signet}<span>${esc(t.collectionEyebrow)}</span></div>
        <h2>${esc(t.collectionTitle)}</h2>
      </div>
      <p>${esc(t.collectionIntro)}</p>
    </div>
    <div class="piece-grid">${cards}</div>
  </section>

  <section class="focus-section" id="focus">
    <div class="focus-layout">
      <div class="focus-panel" data-reveal>
        <div class="section-kicker">${signet}<span>${esc(t.focusEyebrow)}</span></div>
        <h2>${esc(t.focusTitle)}</h2>
        <p>${esc(t.focusBody)}</p>
        <div class="focus-points">
          <article><span>${icons.cross}</span><p>${esc(t.focusA)}</p></article>
          <article><span>${icons.ribbon}</span><p>${esc(t.focusB)}</p></article>
          <article><span>${icons.heart}</span><p>${esc(t.focusC)}</p></article>
        </div>
      </div>
      <div class="focus-collage" data-reveal>
        <div class="focus-photo large"><img src="../${catalog[3].imagen_web}" alt="${esc(t.imageAlt)} ${esc(catalog[3][`nombre_comercial_${lang}`])}"></div>
        <div class="focus-photo small"><img src="../${catalog[1].imagen_web}" alt="${esc(t.imageAlt)} ${esc(catalog[1][`nombre_comercial_${lang}`])}"></div>
        <div class="focus-photo chip"><img src="../${catalog[5].recortes_autenticos[1]}" alt="${esc(t.imageAlt)} ${esc(catalog[5][`nombre_comercial_${lang}`])}"></div>
      </div>
    </div>
  </section>

  <section class="order" id="order">
    <div class="section-head section-head-order" data-reveal>
      <div>
        <div class="section-kicker">${signet}<span>${esc(t.orderEyebrow)}</span></div>
        <h2>${esc(t.orderTitle)}</h2>
      </div>
      <p>${esc(t.orderBody)}</p>
    </div>
    <div class="steps">
      <article data-reveal><span>01</span><p>${esc(t.step1)}</p></article>
      <article data-reveal><span>02</span><p>${esc(t.step2)}</p></article>
      <article data-reveal><span>03</span><p>${esc(t.step3)}</p></article>
    </div>
    <div class="cta-box" data-reveal>
      <div>
        <h3>${esc(t.ctaTitle)}</h3>
        <p>${esc(t.ctaText)}</p>
      </div>
      <a class="btn btn-primary" href="${instagram}" target="_blank" rel="noopener noreferrer">${esc(t.ctaButton)} ${icons.arrow}</a>
    </div>
  </section>
</main>

<footer class="site-footer">
  <img src="../assets/logo/logo_contraste_transparente.png" alt="Luz Celestia">
  <p>${esc(t.footer)}</p>
  <a href="${instagram}" target="_blank" rel="noopener noreferrer">${icons.insta}<span>Instagram</span></a>
</footer>

<a class="floating-ig" href="${instagram}" target="_blank" rel="noopener noreferrer">${icons.insta}<span>${esc(t.floating)}</span></a>

<dialog id="piece-dialog" aria-label="Piece detail">
  <button class="dialog-close" type="button" aria-label="${esc(t.close)}">×</button>
  <div class="dialog-shell">
    <div class="dialog-media">
      <div class="dialog-stage"><img id="dialog-image" src="" alt=""></div>
      <div class="dialog-switches">
        <button type="button" data-view="image" aria-pressed="true">${esc(t.full)}</button>
        <button type="button" data-view="closeup" aria-pressed="false">${esc(t.zoom)}</button>
      </div>
    </div>
    <div class="dialog-copy">
      <p class="eyebrow">${esc(t.dialogEyebrow)}</p>
      <div class="dialog-meta"><span id="dialog-state"></span><strong id="dialog-price"></strong></div>
      <h2 id="dialog-name"></h2>
      <p class="dialog-literal" id="dialog-literal"></p>
      <p class="dialog-desc" id="dialog-description"></p>
      <div class="dialog-focus"><span>${esc(t.focusLabel)}</span><b id="dialog-focus"></b></div>
      <p class="dialog-note" id="dialog-note"></p>
      <a class="btn btn-primary" href="${instagram}" target="_blank" rel="noopener noreferrer">${esc(t.ctaButton)} ${icons.arrow}</a>
    </div>
  </div>
</dialog>

<script type="application/json" id="site-data">${JSON.stringify(json)}</script>
<script src="../app.js" defer></script>
</body>
</html>`;
}

for (const lang of ['en','es']) {
  const dir = path.join(dist, lang);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), page(lang));
}

await writeFile(path.join(dist,'index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Luz Celestia</title></head><body><script>const saved=localStorage.getItem("lc_lang");location.replace(saved==="es"?"./es/":"./en/")</script></body></html>');
await writeFile(path.join(dist,'robots.txt'), 'User-agent: *\nAllow: /\n');
await writeFile(path.join(dist,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://ceslestiani.vercel.app/en/</loc></url><url><loc>https://ceslestiani.vercel.app/es/</loc></url></urlset>');
