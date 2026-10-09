from pathlib import Path
import json
r=Path(__file__).resolve().parents[1]
c=r/'src/catalog.json'; products=json.loads(c.read_text())
for p in products:
 stem=Path(p['imagen_original']).stem
 p['imagen_web']=f'assets/productos/campaign-v10/{stem}_campaign.webp'
c.write_text(json.dumps(products,ensure_ascii=False,indent=2))
p=r/'src/locales.json'; d=json.loads(p.read_text())
t=d['en'];t.update({
 'title':'Luz Celestia | Little pieces of faith',
 'meta':'Crosses, ribbon bracelets and small keepsakes inspired by Catholic faith. Discover six pieces and ask about your favorite on Instagram.',
 'heroEyebrow':'LUZ CELESTIA · CATHOLIC-INSPIRED ACCESSORIES',
 'heroTitleA':'Faith in the', 'heroTitleB':'little things.',
 'heroBody':'A ribbon tied by hand. A little cross. A heart you can actually feel. Meet six accessories made to be worn, noticed, and kept close.',
 'heroStrip1':'cross','heroStrip2':'ribbon','heroStrip3':'heart','heroStrip4':'shell',
 'heroCalloutTitle':'Look a little closer',
 'heroCalloutText':'Find the small cross, the raised heart, the gold-toned edge. Sometimes the smallest detail is the one you remember.',
 'collectionTitle':'Meet the pieces.',
 'collectionIntro':'Six accessories, each with its own character. Tap a photograph to see the real details up close.',
 'focusEyebrow':'02 / THE DETAILS',
 'focusTitle':'The little details are the whole point.',
 'focusBody':'A cross speaks for itself. Color, ribbon, texture and shape make every piece feel personal — whether you are keeping one or gifting it.',
 'focusA':'Crosses you can actually see.',
 'focusB':'Ribbons and little textures worth noticing.',
 'focusC':'Pieces that feel personal, not identical.',
 'orderTitle':'Found your favorite?',
 'orderBody':'The easiest way to ask about any piece is through our Instagram. Tell us which one caught your eye.',
 'ctaTitle':'Your piece is one message away.',
 'ctaText':'Questions and pre-orders go straight to @luzcelestia.ni.',
 'footer':'Crosses, hearts and ribbons. Little pieces inspired by faith.',
 'heroBadgeA':'6 pieces','heroBadgeB':'From US$2','heroBadgeC':'ES / EN',
 })
t=d['es'];t.update({
 'title':'Luz Celestia | La fe en los detalles',
 'meta':'Cruces, pulseras de listón y accesorios inspirados en la fe católica. Descubrí seis piezas y consultá por Instagram.',
 'heroEyebrow':'LUZ CELESTIA · ACCESORIOS DE INSPIRACIÓN CATÓLICA',
 'heroTitleA':'La fe también', 'heroTitleB':'está en los detalles.',
 'heroBody':'Un listón anudado. Una cruz pequeña. Un corazón que se siente al tocarlo. Conocé seis accesorios para llevar cerquita o regalar con intención.',
 'heroCalloutTitle':'Mirá un poquito más de cerca',
 'heroCalloutText':'Descubrí la cruz pequeña, el corazón en relieve y los bordes dorados. A veces el detalle más pequeño es el que más recordamos.',
 'collectionTitle':'Conocé las piezas.',
 'collectionIntro':'Seis accesorios y seis maneras de expresar algo personal. Tocá cualquier fotografía para ver sus detalles reales de cerca.',
 'focusEyebrow':'02 / LOS DETALLES',
 'focusTitle':'Los detalles chiquitos hacen toda la diferencia.',
 'focusBody':'La cruz tiene su propio significado. El color, el listón, las texturas y las formas hacen que cada pieza se sienta personal, para llevar o regalar.',
 'focusA':'Cruces que se reconocen al instante.',
 'focusB':'Listones y texturas para mirar de cerca.',
 'focusC':'Piezas con carácter, no copias idénticas.',
 'orderTitle':'¿Ya encontraste tu favorita?',
 'orderBody':'Si alguna pieza te gustó, escribinos por Instagram y contanos cuál. Así de sencillo.',
 'ctaTitle':'Tu favorita está a un mensaje.',
 'ctaText':'Las consultas y preórdenes se hacen por @luzcelestia.ni.',
 'footer':'Cruces, corazones y listones. Detalles inspirados en la fe.',
 'heroBadgeA':'6 piezas','heroBadgeB':'Desde US$2','heroBadgeC':'ES / EN',
 })
p.write_text(json.dumps(d,ensure_ascii=False,indent=2))
# Replace three floating hero photos with single cohesive campaign asset from originals
p=r/'scripts/build.mjs'; s=p.read_text()
start=s.index('      <div class="hero-stage" data-reveal>')
end=s.index('      </div>\n    </div>\n    <div class="hero-strip"',start)+len('      </div>')
s=s[:start]+'''      <div class="hero-stage" data-reveal>
        <div class="hero-campaign-image"><img src="../assets/productos/campaign-v10/hero_originals_campaign.webp" width="1800" height="1350" alt="Real Luz Celestia pieces: pink ribbon bracelet, heart crosses and shell ribbons" loading="eager" fetchpriority="high"></div>
        <div class="hero-note">
          <strong>${esc(t.heroCalloutTitle)}</strong>
          <p>${esc(t.heroCalloutText)}</p>
        </div>
      </div>'''+s[end:]
p.write_text(s)
# stronger editorial styling, no false product image in site
p=r/'src/style.css'; css=p.read_text()
css+='''
/* V10 — photography-first campaign from genuine accessories */
.hero-grid{background:linear-gradient(110deg,#f3e2e0 0%,#fdf3eb 52%,#e5eeec 100%);grid-template-columns:.81fr 1.19fr}
.hero-stage{min-height:620px;display:flex;align-items:center;justify-content:center;padding:26px 12px 30px}
.hero-campaign-image{width:100%;transform:rotate(-1.5deg);border:11px solid rgba(255,250,244,.9);border-radius:26px;overflow:hidden;box-shadow:0 30px 70px rgba(39,52,56,.17)}
.hero-campaign-image img{width:100%;height:auto;object-fit:cover}
.hero-note{left:auto;right:0;bottom:0;width:min(320px,53%);background:rgba(20,65,72,.91)}
.hero h1{font-size:clamp(3.7rem,6.1vw,6.8rem)}
.hero h1 em{margin-left:0;color:#935a70}
.hero-body{font-size:18px;max-width:480px}
.piece-card{border-radius:28px;box-shadow:0 14px 35px rgba(27,49,53,.07)}
.piece-figure img{object-fit:cover;object-position:center}
.piece-card:nth-child(2n) .piece-figure{border-radius:85px 18px 18px 18px;overflow:hidden}
.piece-card:nth-child(3n) .piece-figure{border-radius:18px 18px 90px 18px;overflow:hidden}
.piece-links{margin-top:24px}
.piece-focus{background:rgba(242,224,228,.42)}
.focus-layout{background:linear-gradient(135deg,#133f48 0%,#28646c 67%,#254d51 100%)}
@media(max-width:1180px){.hero-stage{min-height:0;padding:16px 0 40px}.hero-campaign-image{max-width:770px}.hero-note{bottom:10px;right:10px}}
@media(max-width:640px){.hero-stage{min-height:0;padding:12px 0 56px}.hero-campaign-image{border-width:6px;border-radius:18px}.hero-note{position:relative;width:95%;right:auto;bottom:auto;margin:-24px auto 0;z-index:2}.hero-grid{gap:8px}.hero h1{font-size:clamp(3.5rem,13vw,5rem)}}
'''
p.write_text(css)
