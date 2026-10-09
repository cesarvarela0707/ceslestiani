import {createRequire} from 'node:module';import {writeFile} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)('playwright');await import('../scripts/serve.mjs');
const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}: {})});
const results=[];
for(const theme of ['dark','light'])for(const lang of ['en','es'])for(const width of [360,390,430,768,1024,1440]){
const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<700,isMobile:width<700});const page=await context.newPage();await page.goto(`http://127.0.0.1:4321/${lang}/`);if(theme==='light'){await page.locator('.theme-toggle').click();await page.waitForFunction(()=>getComputedStyle(document.body).backgroundColor==='rgb(232, 222, 210)');}await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForLoadState('networkidle');
await page.screenshot({path:`verification/${theme}-${lang}-${width}-hero.jpg`,animations:'disabled'});await page.screenshot({path:`verification/${theme}-${lang}-${width}-full.jpg`,fullPage:true,animations:'disabled'});
await page.locator('#contact').scrollIntoViewIfNeeded();await page.screenshot({path:`verification/${theme}-${lang}-${width}-contact.jpg`,animations:'disabled'});
if(await page.locator('.contact-photo img').evaluate(i=>i.naturalWidth)!==1536)throw Error('HD dimensions');
await page.locator('.piece-image[data-open="4"]').click();await page.locator('#detail-image').evaluate(i=>i.decode());await page.screenshot({path:`verification/${theme}-${lang}-${width}-detail.jpg`,animations:'disabled'});await page.keyboard.press('Escape');
results.push({theme,lang,width,HD:[1536,1024],horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await context.close();console.log('Captured',lang,width);
}
await browser.close();await writeFile('verification/design-results.json',JSON.stringify({results},null,2));process.exit(0);
