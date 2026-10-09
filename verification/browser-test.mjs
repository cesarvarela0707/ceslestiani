import {createRequire} from 'node:module';
const {chromium}=createRequire(import.meta.url)('playwright');
import {writeFile} from 'node:fs/promises';
await import('../scripts/serve.mjs');
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});const results=[];const errors=[];
for(const lang of ['en','es'])for(const width of [360,390,430,768,1024,1440]){
const context=await browser.newContext({viewport:{width,height:900},isMobile:width<700,hasTouch:width<700});const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
await page.goto(`http://127.0.0.1:4321/${lang}/`);await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForLoadState('networkidle');console.log(lang,width);
if(await page.evaluate(()=>getComputedStyle(document.body).backgroundColor)!=='rgb(17, 40, 51)')throw Error('Theme');if((await page.locator('footer').innerText()).includes('feria escolar')||(await page.locator('footer').innerText()).includes('school fair'))throw Error('Footer text');if(await page.locator('.contact-photo img').evaluate(i=>i.naturalWidth)<1536)throw Error('HD contact');
const horizontal=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(horizontal)throw Error('Overflow '+lang+width);
await page.screenshot({path:`verification/${lang}-${width}-full.jpg`,fullPage:true,animations:'disabled'});await page.screenshot({path:`verification/${lang}-${width}-hero.jpg`,animations:'disabled'});
for(let index=0;index<6;index++){
 const opener=page.locator(`.piece-image[data-open="${index}"]`);await opener.click();await page.locator('#detail').waitFor({state:'visible'});
 if(await page.locator('#detail-price').textContent()!==`US$${index===0?2:3}`)throw Error('Wrong price');
 for(let v=0;v<3;v++){await page.locator(`[data-view="${v}"]`).click();await page.locator('#detail-image').evaluate(i=>i.decode());if(!await page.locator('#detail-image').evaluate(i=>i.naturalWidth>0))throw Error('Missing image');}
 await page.locator('.zoom').click();if(!await page.locator('.zoom').evaluate(b=>b.classList.contains('is-zoomed')))throw Error('Zoom');await page.locator('.zoom').click();
 await page.locator('[data-view="0"]').click();await page.keyboard.press('ArrowRight');if(await page.locator('[data-view="1"]').getAttribute('aria-pressed')!=='true')throw Error('Arrow key');
 if(index===4)await page.screenshot({path:`verification/${lang}-${width}-detail.jpg`,animations:'disabled'});
 await page.keyboard.press('Escape');if(await page.locator('#detail').evaluate(d=>d.open))throw Error('Escape');if(!await opener.evaluate(b=>b===document.activeElement))throw Error('Focus not restored');
}
const links=await page.locator('a[target="_blank"]').evaluateAll(a=>a.map(a=>a.href));if(links.some(l=>l!=='https://www.instagram.com/luzcelestia.ni/'))throw Error('Wrong commercial link');
await page.locator('.languages a[lang="'+(lang==='en'?'es':'en')+'"]').click();await page.waitForURL(`**/${lang==='en'?'es':'en'}/`);if(await page.evaluate(()=>localStorage.getItem('lc_lang'))!==(lang==='en'?'es':'en'))throw Error('Persistence');await page.goto('http://127.0.0.1:4321/');await page.waitForURL(`**/${lang==='en'?'es':'en'}/`);
results.push({lang,width,horizontalOverflow:false,pieces:6,galleryViews:18,prices:'pass',escape:'pass',focusReturn:'pass',keyboardGallery:'pass',zoom:'pass',instagramLinks:'pass',languagePersistence:'pass'});await page.close();}
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});const page=await context.newPage();await page.goto('http://127.0.0.1:4321/en/');await page.locator('.piece-image[data-open="4"]').click();
await page.locator('.zoom').dispatchEvent('pointerdown',{pointerType:'touch',clientX:280,clientY:160});await page.locator('.zoom').dispatchEvent('pointerup',{pointerType:'touch',clientX:120,clientY:165});if(await page.locator('[data-view="1"]').getAttribute('aria-pressed')!=='true')throw Error('Swipe');
await page.locator('.copy-name').click();if(await page.evaluate(()=>navigator.clipboard.readText())!=='Pink ribbon duo')throw Error('Copy name');if(await page.locator('.copy-status').textContent()!=='Name copied')throw Error('Copy feedback');
await page.keyboard.press('Tab');for(let i=0;i<18;i++){await page.keyboard.press('Tab');if(!await page.evaluate(()=>document.querySelector('#detail').contains(document.activeElement)))throw Error('Focus trap');}
results.push({copyName:'pass',copyFeedback:'pass',swipe:'pass',focusTrap:'pass',reducedMotion:await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)});await page.close();await browser.close();if(errors.length)throw Error(JSON.stringify(errors));await writeFile('verification/browser-results.json',JSON.stringify({browser:'Chromium headless, Playwright',results,errors},null,2));console.log('PASS: 12 language/viewport combinations, 72 product dialogs, 216 images, keyboard, focus, zoom, swipe, persistence, HD scene, dark theme, copy feedback.');

process.exit(0);
