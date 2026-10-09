import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import vm from 'node:vm';

const catalog = JSON.parse(await readFile('src/catalog.json', 'utf8'));
const texts = JSON.parse(await readFile('src/locales.json', 'utf8'));
assert.equal(catalog.length, 6, 'Exactly six products');
assert.equal(catalog.filter(x => x.modalidad === 'preorden').length, 5, 'Exactly five pre-orders');
assert.deepEqual(Object.keys(texts.en).sort(), Object.keys(texts.es).sort(), 'Both languages have matching keys');

for (let i = 0; i < catalog.length; i++) {
  const p = catalog[i];
  assert.equal(p.precio_usd, i === 0 ? 2 : 3, 'Prices preserved');
  assert.ok(p.imagen_original && p.imagen_web && p.recortes_autenticos?.length === 2);
}

for (const lang of ['en', 'es']) {
  const html = await readFile(`dist/${lang}/index.html`, 'utf8');
  assert.ok(html.includes(`<html lang="${lang}">`));
  assert.equal((html.match(/class="piece-card/g) || []).length, 6, 'Six product cards');
  assert.equal((html.match(/<strong>US\$/g) || []).length >= 6, true, 'Prices present');
  assert.equal((html.match(/class="piece-state"/g) || []).length, 5, 'Five pre-order badges');
  assert.ok(!html.includes('LC-00'), 'No internal codes shown');
  assert.ok(!/<form|<input|<iframe/i.test(html), 'No extra forms');

  const block = html.match(/<script type="application\/json" id="site-data">([\s\S]*?)<\/script>/);
  assert.ok(block, 'JSON payload present');
  const payload = JSON.parse(block[1]);
  assert.equal(payload.catalog.length, 6, 'Dialog data has six products');

  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (url.startsWith('#')) continue;
    if (url.startsWith('https://')) {
      assert.ok(url === 'https://www.instagram.com/luzcelestia.ni/' || url.startsWith('https://ceslestiani.vercel.app/'), `Unexpected URL ${url}`);
      continue;
    }
    const target = resolve(dirname(resolve(`dist/${lang}/index.html`)), url);
    await access(target);
  }
}

new vm.Script(await readFile('src/app.js', 'utf8'));
const style = await readFile('src/style.css', 'utf8');
assert.ok(style.includes('prefers-reduced-motion'));
assert.ok(style.includes(':focus-visible'));
const robots = await readFile('dist/robots.txt', 'utf8');
assert.ok(robots.includes('Allow: /'));
console.log('PASS — V9 static build validates.');
