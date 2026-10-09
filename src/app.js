let cleanup=()=>{};
async function changeLanguage(next,push=true){
 const position=scrollY;
 const response=await fetch(`/${next}/`);if(!response.ok)throw Error('Language unavailable');
 const parsed=new DOMParser().parseFromString(await response.text(),'text/html');
 const update=()=>{cleanup();document.body.replaceWith(parsed.body);document.documentElement.lang=next;document.title=parsed.title;for(const selector of ['meta[name="description"]','meta[property="og:description"]','link[rel="canonical"]']){const source=parsed.querySelector(selector);document.querySelector(selector)?.replaceWith(source);}if(push)history.pushState({lang:next},'',`/${next}/`);initSite();scrollTo({top:position,behavior:'instant'});document.querySelector(`.languages a[lang="${next}"]`).focus({preventScroll:true});};
 if(document.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)await document.startViewTransition(update).finished;else update();
}
function initSite(){
 const controller=new AbortController(),signal=controller.signal,disposers=[];
 cleanup=()=>{controller.abort();disposers.forEach(fn=>fn());};
const {lang,t,catalog}=JSON.parse(document.querySelector('#site-data').textContent);
try{localStorage.setItem('lc_lang',lang)}catch{}
const dialog=document.querySelector('#detail'), image=document.querySelector('#detail-image'),zoom=document.querySelector('.zoom'),tabs=[...document.querySelectorAll('[data-view]')];
let current=0,view=0,trigger=null,start=null,suppressClick=false;
function updateView(next){view=(next+3)%3;const p=catalog[current];image.src=`/assets/campaign/${p.id}${view===1?'-detail-hd':view===2?'-lifestyle':''}.webp`;image.dataset.scene=view===1?'detail':view===2?'lifestyle':'campaign';image.style.objectPosition=view===1?`center ${[70,65,45,55,65,50][current]}%`:'center';image.alt=`${p[lang].name} — ${[t.campaign,t.detail,t.lifestyle][view]}`;tabs.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.view)===view)));zoom.classList.remove('is-zoomed');zoom.setAttribute('aria-label',t.zoom);zoom.setAttribute('aria-pressed','false');}
function open(index,opener){current=index;trigger=opener;const p=catalog[index],c=p[lang];document.querySelector('#detail-name').textContent=c.name;document.querySelector('#detail-price').textContent=`US$${p.price}`;document.querySelector('#detail-state').textContent=index===0?t.available:t.preorder;document.querySelector('#detail-description').textContent=c.description;document.querySelector('#detail-focus').textContent=c.detail;document.querySelector('#order-note').textContent=index===0?t.availNote:t.preNote;const original=document.querySelector('#original-image');original.src=`/assets/originals/${p.id}.jpg`;original.alt=`${c.name} — ${t.original}`;document.querySelector('.original-reference').open=false;updateView(0);dialog.showModal();document.querySelector('.close').focus({preventScroll:true});document.body.classList.add('modal-open');}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>open(Number(b.dataset.open),b)));
document.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
tabs.forEach(b=>b.addEventListener('click',()=>updateView(Number(b.dataset.view))));document.querySelector('.previous').addEventListener('click',()=>updateView(view-1));document.querySelector('.next').addEventListener('click',()=>updateView(view+1));
zoom.addEventListener('click',()=>{if(suppressClick){suppressClick=false;return;}const enlarged=zoom.classList.toggle('is-zoomed');zoom.setAttribute('aria-pressed',String(enlarged));zoom.setAttribute('aria-label',enlarged?t.unzoom:t.zoom);});
zoom.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')start={x:e.clientX,y:e.clientY};});zoom.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClick=true;updateView(view+(dx<0?1:-1));}});zoom.addEventListener('pointercancel',()=>start=null);
document.addEventListener('keydown',e=>{if(dialog.open&&e.key==='ArrowRight'){e.preventDefault();updateView(view+1);}if(dialog.open&&e.key==='ArrowLeft'){e.preventDefault();updateView(view-1);}},{signal});
document.querySelectorAll('.languages a').forEach(a=>a.addEventListener('click',async event=>{if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;event.preventDefault();if(a.lang===lang)return;const links=document.querySelector('.languages');if(links.getAttribute('aria-busy')==='true')return;links.setAttribute('aria-busy','true');try{await changeLanguage(a.lang);}catch{location.assign(a.href);}}));
const themeButton=document.querySelector('.theme-toggle');
function syncTheme(){const light=document.documentElement.dataset.theme==='light';const label=light?t.themeDark:t.themeLight;themeButton.setAttribute('aria-label',label);themeButton.setAttribute('title',label);themeButton.setAttribute('aria-pressed',String(light));document.querySelector('meta[name="theme-color"]').content=light?'#e8ded2':'#112833';}
syncTheme();themeButton.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=next;try{localStorage.setItem('lc_theme',next);}catch{}syncTheme();});


dialog.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const focusable=[...dialog.querySelectorAll('button,a[href],summary')].filter(el=>!el.disabled&&el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||!dialog.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!dialog.contains(document.activeElement))){e.preventDefault();first.focus();}});

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const viewLabels=[t.campaign,t.detail,t.lifestyle];
function updateGalleryStatus(){document.querySelector('.gallery-view-label').textContent=viewLabels[view];document.querySelector('.gallery-count').textContent=`0${view+1} / 03`;}
image.addEventListener('load',()=>{updateGalleryStatus();if(!reducedMotion.matches)image.animate([{opacity:.4,filter:'blur(2px)'},{opacity:1,filter:'blur(0)'}],{duration:280,easing:'ease-out'});});
const viewObserver=new MutationObserver(updateGalleryStatus);viewObserver.observe(image,{attributes:true,attributeFilter:['src']});disposers.push(()=>viewObserver.disconnect());
const copyButton=document.querySelector('.copy-name'),copyStatus=document.querySelector('.copy-status');
copyButton.addEventListener('click',async()=>{const name=catalog[current][lang].name;try{await navigator.clipboard.writeText(name);copyStatus.textContent=t.copied;copyButton.classList.add('copied');}catch{copyStatus.textContent=t.copyFailed;const selection=getSelection(),range=document.createRange();range.selectNodeContents(document.querySelector('#detail-name'));selection.removeAllRanges();selection.addRange(range);}});
dialog.addEventListener('close',()=>{copyStatus.textContent='';copyButton.classList.remove('copied');});
if(!reducedMotion.matches){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-revealed');observer.unobserve(entry.target);}},{threshold:.12});document.querySelectorAll('.piece,.chapter-title,.opening-note,.shell-copy,.contact-copy').forEach(el=>observer.observe(el));disposers.push(()=>observer.disconnect());}
let progressQueued=false;
function updateProgress(){const scrollRange=document.documentElement.scrollHeight-innerHeight;document.querySelector('.reading-progress').style.transform=`scaleX(${scrollRange>0?Math.min(1,scrollY/scrollRange):0})`;progressQueued=false;}
addEventListener('scroll',()=>{if(!progressQueued){progressQueued=true;requestAnimationFrame(updateProgress);}},{passive:true,signal});addEventListener('resize',updateProgress,{signal});updateProgress();
if(matchMedia('(hover:hover) and (pointer:fine)').matches){document.querySelectorAll('.button').forEach(button=>{button.addEventListener('pointermove',event=>{if(reducedMotion.matches)return;const rect=button.getBoundingClientRect();button.style.setProperty('--magnet-x',`${(event.clientX-rect.left-rect.width/2)*.035}px`);button.style.setProperty('--magnet-y',`${(event.clientY-rect.top-rect.height/2)*.09}px`);});button.addEventListener('pointerleave',()=>{button.style.setProperty('--magnet-x','0px');button.style.setProperty('--magnet-y','0px');});});zoom.addEventListener('pointermove',event=>{if(zoom.classList.contains('is-zoomed')){const rect=zoom.getBoundingClientRect();image.style.transformOrigin=`${(event.clientX-rect.left)/rect.width*100}% ${(event.clientY-rect.top)/rect.height*100}%`;}});}
zoom.addEventListener('pointerleave',()=>{image.style.transformOrigin='center';});

}
initSite();
addEventListener('popstate',()=>{const next=location.pathname.startsWith('/es')?'es':'en';if(next!==document.documentElement.lang)changeLanguage(next,false).catch(()=>location.reload());});
