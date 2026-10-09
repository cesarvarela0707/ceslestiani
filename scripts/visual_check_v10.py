import asyncio,base64,re,mimetypes
from pathlib import Path
from playwright.async_api import async_playwright
R=Path(__file__).resolve().parents[1];D=R/'dist'
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  for lang,w in [('en',1440),('en',390),('es',390)]:
   html=(D/lang/'index.html').read_text()
   css=(D/'style.css').read_text()
   js=(D/'app.js').read_text()
   html=html.replace('<link rel="stylesheet" href="../style.css">','<style>'+css+'</style>')
   html=html.replace('<script src="../app.js" defer></script>','<script>'+js+'</script>')
   def process(m):
    attr,val=m.group(1),m.group(2)
    if val.startswith('../assets/'):
     path=(D/lang/val).resolve()
     ext=path.suffix.lower(); typ={'.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'}.get(ext,'application/octet-stream')
     if path.exists():return attr+'="data:'+typ+';base64,'+base64.b64encode(path.read_bytes()).decode()+'"'
    return m.group(0)
   html=re.sub(r'(src)="([^"]+)"',process,html)
   page=await browser.new_page(viewport={'width':w,'height':900},device_scale_factor=1)
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   await page.set_content(html,wait_until='load',timeout=60000)
   await page.evaluate("document.querySelectorAll('[data-reveal]').forEach(e=>e.classList.add('visible'))")
   await page.screenshot(path=str(R/f'PREVIEW_{lang}_{w}.png'),full_page=True,timeout=60000)
   info=await page.evaluate('''() => ({ cards: document.querySelectorAll('.piece-card').length, images: [...document.images].filter(i=>i.complete&&i.naturalWidth>0).length, total:document.images.length, overflow:document.documentElement.scrollWidth>innerWidth })''')
   print(lang,w,info,'errors',errors)
   try:
    await page.locator('[data-open="0"]').first.click(timeout=5000)
    print('modalOpen',await page.locator('#piece-dialog').evaluate('(el)=>el.open'))
    await page.locator('.dialog-close').click(timeout=5000)
   except Exception as e: print('modal test error',str(e)[:160])
   await page.close()
  await browser.close()
asyncio.run(main())
