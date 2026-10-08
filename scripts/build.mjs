import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';

const catalog = JSON.parse(await readFile('src/catalog.json', 'utf8'));
const locales = JSON.parse(await readFile('src/locales.json', 'utf8'));
const brand = JSON.parse(await readFile('docs/identidad_confirmada.json', 'utf8'));

const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const dir of ['logo', 'fonts', 'productos/web', 'productos/recortes', 'productos/editorial']) {
  await cp('assets/' + dir, 'dist/assets/' + dir, { recursive: true });
}
for (const file of ['style.css', 'app.js']) await cp('src/' + file, 'dist/' + file);

const arrow = '<span aria-hidden="true">↗</span>';
const instagram = (label, cls = '') => `<a class="${cls}" href="${brand.instagram_url}" target="_blank" rel="noopener noreferrer">${esc(label)}${arrow}</a>`;
const ribbon = cls => `<svg class="ribbon ${cls}" viewBox="0 0 1200 560" fill="none" aria-hidden="true" focusable="false"><path d="M-60 350C180 80 470 500 620 280C745 95 840 28 864 145C893 290 510 276 736 355C900 412 1030 145 1280 200" stroke="currentColor" stroke-width="2"/><path d="M-60 365C170 110 470 525 633 290C755 112 838 52 850 152C866 255 565 278 742 340C920 398 1030 159 1280 215" stroke="currentColor" stroke-width="1"/></svg>`;
const picture = (src, alt, cls = '', attrs = 'loading="lazy" decoding="async"') => `<img class="${cls}" src="../${src}" alt="${esc(alt)}" width="1200" height="1200" ${attrs}>`;

for (const lang of ['es', 'en']) {
  const t = locales[lang];
  const other = lang === 'es' ? 'en' : 'es';
  const name = p => p['nombre_comercial_' + lang];
  const descriptor = p => p['descripcion_literal_' + lang];
  const desc = p => p['descripcion_comercial_' + lang];

  const product = index => {
    const p = catalog[index];
    const eager = index < 2 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
    return `<article class="story-card piece-${index}" id="piece-${index}" data-product="${index}">
      <div class="media-shell">
        <button class="photo-button" data-open="${index}" aria-haspopup="dialog" aria-label="${esc(t.detail + ': ' + name(p))}">
          <span class="media-fill media-fill-${index}" aria-hidden="true"></span>
          ${picture(p.imagen_web, `${t.imageAlt} ${descriptor(p)}`, 'main-shot', eager)}
          ${[0,2,3].includes(index) ? `<span class="mini-shot">${picture(p.recortes_autenticos[1], `${t.imageAlt} ${descriptor(p)} · ${t.crop}`, 'mini-shot-image')}</span>` : ''}
          <span class="inspect">${t.detail}${arrow}</span>
        </button>
      </div>
      <div class="product-info">
        <div class="product-topline"><p class="descriptor-sm">${esc(descriptor(p))}</p>${p.modalidad === 'preorden' ? `<span class="badge">${t.preorder}</span>` : ''}</div>
        <div class="product-title"><h3>${esc(name(p))}</h3><span class="price" aria-label="${esc(t.price + ': ' + p.precio_usd)}">US$${p.precio_usd}</span></div>
        <p class="product-desc">${esc(desc(p))}</p>
        <div class="product-actions"><button class="ghost-link" type="button" data-open="${index}">${t.detail}<span aria-hidden="true">→</span></button>${instagram(t.instagram, 'product-link')}</div>
      </div>
    </article>`;
  };

  const spreads = [[0,3],[1,2],[4,5]].map((pair, i) => `
    <section class="spread spread-${i}" aria-labelledby="spread-title-${i}">
      <div class="spread-heading"><div><p class="eyebrow">0${i + 1}</p><h3 id="spread-title-${i}">${t.spreads[i].title}</h3></div><p>${t.spreads[i].note}</p></div>
      <div class="spread-products">${pair.map(product).join('')}</div>
    </section>`).join('');

  const publicCatalog = catalog.map(p => ({
    precio_usd: p.precio_usd,
    modalidad: p.modalidad,
    nombre_comercial: name(p),
    descripcion_literal: descriptor(p),
    descripcion_comercial: desc(p),
    imagen_web: p.imagen_web,
    recorte: p.recortes_autenticos[1]
  }));
  const data = JSON.stringify({ lang, t, catalog: publicCatalog }).replace(/</g, '\\u003c');

  const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#fffbf5"><title>${esc(t.title)}</title>
  <meta name="description" content="${esc(t.meta)}">
  <meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.meta)}"><meta property="og:type" content="website"><meta property="og:locale" content="${lang === 'es' ? 'es_NI' : 'en_US'}">
  <link rel="alternate" hreflang="${other}" href="../${other}/"><link rel="icon" type="image/png" href="../assets/logo/favicon.png">
  <link rel="preload" as="font" href="../assets/fonts/lmroman-regular.woff" type="font/woff" crossorigin>
  <link rel="stylesheet" href="../style.css"><script defer src="../app.js"></script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="header">
  <a class="brand" href="#top" aria-label="${t.back}"><span class="brand-mark"><img src="../assets/logo/logo_contraste_transparente.png" width="1385" height="484" alt="${t.logoAlt}"></span></a>
  <nav aria-label="${t.nav}"><a href="#collection">${t.collection}</a><a href="#order">${t.orderNav}</a>${instagram('Instagram', 'header-ig')}</nav>
  <div class="languages" aria-label="${t.language}"><a href="../es/" lang="es" hreflang="es" ${lang === 'es' ? 'aria-current="page"' : ''}>ES</a><span aria-hidden="true">/</span><a href="../en/" lang="en" hreflang="en" ${lang === 'en' ? 'aria-current="page"' : ''}>EN</a></div>
</header>
<a class="floating-ig" href="${brand.instagram_url}" target="_blank" rel="noopener noreferrer">${t.floatingIg}${arrow}</a>
<main id="main">
  <section class="hero" id="top" aria-labelledby="hero-title">
    ${ribbon('hero-ribbon')}
    <div class="hero-shell">
      <div class="hero-copy">
        <p class="eyebrow">${t.kicker}</p>
        <h1 id="hero-title">${t.hero1}<br><em>${t.hero2}</em></h1>
        <p class="hero-intro">${t.heroIntro}</p>
        <div class="hero-actions"><a class="button" href="#collection">${t.discover}<span aria-hidden="true">↓</span></a>${instagram(t.instagram, 'ghost-button')}</div>
        <p class="hero-meta" title="${t.currency}">${t.from}</p>
        <div class="hero-badge">${t.heroBadge}</div>
      </div>
      <div class="hero-visual">
        <figure class="hero-main">
          <img src="../assets/productos/editorial/hero_marea_960.webp" srcset="../assets/productos/editorial/hero_marea_480.webp 480w, ../assets/productos/editorial/hero_marea_960.webp 960w" sizes="(max-width: 768px) 90vw, 42vw" alt="${t.heroAlt}" width="960" height="823" fetchpriority="high">
          <figcaption><strong>${esc(name(catalog[4]))}</strong><span>${t.heroCaption}</span></figcaption>
        </figure>
        <figure class="hero-polaroid hero-polaroid-a">${picture(catalog[2].recortes_autenticos[1], t.heroSideAlt, '', 'loading="eager" decoding="async"')}<figcaption>${esc(name(catalog[2]))}</figcaption></figure>
        <figure class="hero-polaroid hero-polaroid-b">${picture(catalog[0].recortes_autenticos[1], `${t.imageAlt} ${descriptor(catalog[0])}`, '', 'loading="eager" decoding="async"')}<figcaption>${esc(name(catalog[0]))}</figcaption></figure>
        <p class="hero-note">${t.heroNote}</p>
      </div>
    </div>
  </section>

  <section class="collection section" id="collection" aria-labelledby="collection-title">
    <div class="section-heading">
      <div><p class="eyebrow">${t.collectionKicker}</p><h2 id="collection-title">${t.collectionTitle.replace('\n', '<br>')}</h2></div>
      <p>${t.collectionIntro}</p>
    </div>
    ${spreads}
  </section>

  <section class="essence section" aria-labelledby="essence-title">
    ${ribbon('essence-ribbon')}
    <div class="essence-copy"><p class="eyebrow">LUZ CELESTIA</p><h2 id="essence-title">${t.essenceTitle}</h2><p>${t.essenceText}</p></div>
    <div class="essence-card"><img src="../assets/logo/logo_contraste_transparente.png" width="1385" height="484" alt="${t.logoAlt}"><p>${t.essenceCard}</p>${instagram(t.instagram, 'button')}</div>
  </section>

  <section class="order section" id="order" aria-labelledby="order-title">
    <div class="order-heading"><div><p class="eyebrow">${t.orderKicker}</p><h2 id="order-title">${t.orderTitle}</h2></div><p>${t.orderIntro}</p></div>
    <ol class="steps">${t.steps.map((s, i) => `<li><span class="step-no" aria-hidden="true">0${i + 1}</span><div><h3>${s[0]}</h3><p>${s[1]}</p></div></li>`).join('')}</ol>
  </section>
</main>
<footer><div><span class="footer-name">Luz Celestia</span><p>${t.footer}</p></div>${instagram(brand.instagram_usuario)}</footer>
<dialog aria-labelledby="detail-name" aria-describedby="detail-note">
  <div class="dialog-top"><span class="eyebrow">${t.detailHeading}</span><button class="close" aria-label="${t.close}" autofocus>×</button></div>
  <div class="dialog-body"><div class="dialog-visual"><div class="detail-image-stage"><img id="detail-image" alt="" width="1200" height="1400"></div><div class="view-buttons" role="group" aria-label="${t.gallery}"><button data-view="general" aria-pressed="true">${t.general}</button><button data-view="zoom" aria-pressed="false">${t.zoom}</button></div><p class="photo-note">${t.samePhoto}</p></div><div class="dialog-info"><p class="eyebrow" id="detail-state"></p><div class="product-title"><h2 id="detail-name"></h2><span class="price" id="detail-price"></span></div><p id="detail-descriptor" class="descriptor"></p><p id="detail-desc"></p><p id="detail-note"></p>${instagram(t.instagram, 'button')}</div></div>
</dialog>
<script type="application/json" id="site-data">${data}</script>
</body></html>`;

  await mkdir('dist/' + lang, { recursive: true });
  await writeFile('dist/' + lang + '/index.html', html);
}

await writeFile('dist/index.html', `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Luz Celestia</title><script>let l='es';try{l=localStorage.getItem('lc-lang')||((navigator.language||'es').startsWith('en')?'en':'es')}catch{}location.replace('./'+(l==='en'?'en':'es')+'/'+location.hash)</script><noscript><meta http-equiv="refresh" content="0;url=./es/"></noscript></head><body><a href="./es/">Español</a> · <a href="./en/">English</a></body></html>`);

console.log('Build V5: ES/EN, seis productos, estética refinada y salida estática lista para Vercel.');
