import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';

const catalog = JSON.parse(await readFile('src/catalog.json', 'utf8'));
const original = JSON.parse(await readFile('docs/catalogo_EXACTAMENTE_6.json', 'utf8'));
const locales = JSON.parse(await readFile('src/locales.json', 'utf8'));
const ig = 'https://www.instagram.com/luzcelestia.ni/';

assert.equal(catalog.length, 6);
assert.equal(new Set(catalog.map(p => p.id)).size, 6);
assert.deepEqual(Object.keys(locales.es).sort(), Object.keys(locales.en).sort());
for (let i = 0; i < 6; i++) {
  const p = catalog[i];
  assert.equal(p.id, `LC-00${i + 1}`);
  assert.equal(p.precio_usd, i === 0 ? 2 : 3);
  assert.equal(p.modalidad, i === 0 ? 'consulta' : 'preorden');
  for (const key of ['imagen_original', 'imagen_web', 'recortes_autenticos']) assert.deepEqual(p[key], original[i][key]);
  for (const lang of ['es', 'en']) {
    assert.ok(p[`nombre_comercial_${lang}`]?.length > 2);
    assert.ok(p[`descripcion_comercial_${lang}`]?.length > 8);
  }
}

const app = await readFile('src/app.js', 'utf8');
new vm.Script(app);

class Element {
  constructor(dataset = {}) {
    this.dataset = dataset;
    this.listeners = {};
    this.attrs = {};
    this.textContent = '';
    this.src = '';
    this.alt = '';
    this.hash = '';
    this.classList = { add() {}, toggle() {} };
  }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  setAttribute(key, value) { this.attrs[key] = value; }
  hasAttribute(key) { return key in this.attrs; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; this.listeners.close?.(); }
  getBoundingClientRect() { return { left: 0, right: 900, top: 0, bottom: 900 }; }
}

for (const lang of ['es', 'en']) {
  const html = await readFile(`dist/${lang}/index.html`, 'utf8');
  assert.ok(html.includes(`<html lang="${lang}">`));
  assert.equal((html.match(/class="story-card piece-/g) || []).length, 6);
  assert.equal((html.match(/class="badge"/g) || []).length, 5);
  assert.equal((html.match(/class="price" aria-label=/g) || []).length, 6);
  assert.equal((html.match(/class="spread spread-/g) || []).length, 3);
  assert.ok(!html.includes('LC-'));
  assert.ok(!html.includes('href="#"'));
  assert.ok(!/<form|<input|<iframe/i.test(html));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith('#')) { assert.ok(html.includes(`id="${url.slice(1)}"`)); continue; }
    if (url.startsWith('https:')) { assert.equal(url, ig); continue; }
    await access(new URL(url, `file://${process.cwd()}/dist/${lang}/index.html`));
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const candidate of m[1].split(',')) {
      await access(new URL(candidate.trim().split(' ')[0], `file://${process.cwd()}/dist/${lang}/index.html`));
    }
  }
  for (const p of catalog) {
    assert.ok(html.includes(p[`nombre_comercial_${lang}`]));
    assert.ok(html.includes(p[`descripcion_comercial_${lang}`]));
  }

  const match = html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/);
  const parsed = JSON.parse(match[1]);
  const t = parsed.t;
  const ids = Object.fromEntries(['detail-name', 'detail-price', 'detail-descriptor', 'detail-desc', 'detail-state', 'detail-note', 'detail-image'].map(id => [id, new Element()]));
  const dialog = new Element();
  const close = new Element();
  const data = new Element(); data.textContent = match[1];
  const opens = Array.from({ length: 12 }, (_, i) => new Element({ open: String(i % 6) }));
  const views = ['general', 'zoom'].map(view => new Element({ view }));
  const links = [new Element(), new Element()];
  const document = {
    body: new Element(),
    querySelector: s => ({ '#site-data': data, 'dialog': dialog, '.close': close }[s]),
    querySelectorAll: s => ({ '.languages a': links, '[data-view]': views, '[data-open]': opens, '.story-card, .hero-main, .hero-polaroid': [] }[s] || []),
    getElementById: id => ids[id]
  };
  for (const reduced of [true, false]) {
    const context = vm.createContext({
      document,
      localStorage: { setItem() {} },
      location: { hash: '#collection' },
      window: { matchMedia: () => ({ matches: reduced }) }
    });
    new vm.Script(app).runInContext(context);
    for (let i = 0; i < 6; i++) {
      opens[i].listeners.click();
      assert.equal(dialog.open, true);
      assert.equal(ids['detail-name'].textContent, parsed.catalog[i].nombre_comercial);
      assert.equal(ids['detail-price'].textContent, 'US$' + catalog[i].precio_usd);
      assert.equal(ids['detail-state'].textContent, i === 0 ? '' : t.preorder);
      views[1].listeners.click();
      assert.equal(ids['detail-image'].src, '../' + parsed.catalog[i].recorte);
      assert.equal(views[1].attrs['aria-pressed'], 'true');
      views[0].listeners.click();
      assert.equal(ids['detail-image'].src, '../' + parsed.catalog[i].imagen_web);
      close.listeners.click();
      assert.equal(dialog.open, false);
      assert.equal(opens[i].focused, true);
    }
    links[1].listeners.click();
    assert.equal(links[1].hash, '#collection');
  }
}

const css = await readFile('src/style.css', 'utf8');
assert.ok(css.includes('prefers-reduced-motion'));
assert.ok(css.includes(':focus-visible'));
for (const m of css.matchAll(/url\('([^']+)'\)/g)) await access('dist/' + m[1]);

const root = await readFile('dist/index.html', 'utf8');
new vm.Script(root.match(/<script>([\s\S]*?)<\/script>/)[1]);

console.log('PASS · V5 validada: ES/EN, seis productos, precios correctos, cinco preórdenes, recursos y enlaces accesibles, modal funcional y contenido público limpio.');
