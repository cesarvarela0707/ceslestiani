from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageOps
import math, random
R=Path(__file__).resolve().parents[1]
SRC=R/'assets/productos/originales'
OUT=R/'assets/productos/campaign-v10'; OUT.mkdir(parents=True,exist_ok=True)
files=['pulseras_liston_medalla','cruces_blancas_doradas','cruces_corazon_rosa','pulseras_concha_dorada','pulsera_medalla_concha','cruces_corazon_color']
backs=['#ead8d8','#ece5dc','#f1e2e1','#dce9e7','#edcfd7','#efe4df']
inks=['#a97080','#b39264','#ba7f91','#609a9c','#a7667e','#bb9382']

def rgb(h):return tuple(bytes.fromhex(h[1:]))
def gradient(w,h,a,b):
 a=rgb(a); b=rgb(b); im=Image.new('RGB',(w,h)); p=im.load()
 for y in range(h):
  t=min(1,max(0,0.09+0.85*y/h)); c=tuple(int(a[i]*(1-t)+b[i]*t) for i in range(3))
  for x in range(w):p[x,y]=c
 return im

def decorate(d,w,h,ink):
 col=rgb(ink)+(60,)
 for i in range(6):
  x=60+i*17; y=h-340+i*15
  d.arc([x,y,x+380,y+380],180,310,fill=col,width=3)
 for i in range(4):
  cx=w-140-i*22;cy=150+i*30
  d.ellipse([cx-3,cy-3,cx+3,cy+3],fill=rgb(ink)+(80,))

for i,stem in enumerate(files):
 orig=Image.open(SRC/(stem+'.jpg')).convert('RGB')
 w,h=1200,1450
 canv=gradient(w,h,backs[i],'#fff9f3').convert('RGBA')
 blurred=ImageOps.fit(orig,(w,h),method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(65)).convert('RGBA')
 canv=Image.blend(canv,blurred,.15)
 ov=Image.new('RGBA',(w,h)); d=ImageDraw.Draw(ov)
 d.rounded_rectangle((90,110,1105,1300),radius=52,fill=(255,251,246,214),outline=(255,255,255,240),width=5)
 decorate(d,w,h,inks[i]);canv=Image.alpha_composite(canv,ov)
 x0,y0,x1,y1=135,160,1065,1250
 pw,ph=x1-x0,y1-y0
 im=ImageOps.contain(orig,(pw,ph),Image.Resampling.LANCZOS)
 # Original photo genuinely featured; no invented product changes
 mat=Image.new('RGBA',(pw,ph), (247,237,228,255))
 mat.paste(im,((pw-im.width)//2,(ph-im.height)//2))
 canv.alpha_composite(mat,(x0,y0))
 draw=ImageDraw.Draw(canv)
 draw.rounded_rectangle((x0-2,y0-2,x1+2,y1+2),radius=18,outline=rgb(inks[i])+(90,),width=5)
 # Small embossed-looking circular stamp, decorative only
 draw.ellipse((1035,1150,1140,1255),fill=(255,250,247,233),outline=rgb(inks[i])+(90,),width=3)
 draw.line((1065,1190,1109,1190),fill=rgb(inks[i])+(180,),width=3)
 draw.line((1087,1168,1087,1212),fill=rgb(inks[i])+(180,),width=3)
 canv.convert('RGB').save(OUT/(stem+'_campaign.webp'),'WEBP',quality=88,method=6)
 print(stem,(OUT/(stem+'_campaign.webp')).stat().st_size)

# Hero banner composition from real originals
W,H=1800,1350
hero=gradient(W,H,'#f1dcd9','#fff6ec').convert('RGBA')
shape=Image.new('RGBA',(W,H));d=ImageDraw.Draw(shape)
d.ellipse((760,-190,1900,900),fill=(204,228,228,135))
d.ellipse((-600,600,700,1800),fill=(226,175,189,80))
for k in range(7):d.arc((120+k*32,600+k*13,1260+k*19,1600+k*14),178,315,fill=(157,100,115,55),width=4)
hero=Image.alpha_composite(hero,shape)
for stem,box,rot in [
 ('pulsera_medalla_concha',(250,260,1120,1080),-7),
 ('cruces_corazon_rosa',(1040,85,1650,725),8),
 ('pulseras_concha_dorada',(1150,650,1720,1270),-8)]:
 original=Image.open(SRC/(stem+'.jpg')).convert('RGB')
 bw,bh=box[2]-box[0],box[3]-box[1]
 display=ImageOps.fit(original,(bw-42,bh-42),Image.Resampling.LANCZOS)
 panel=Image.new('RGBA',(bw,bh),'#fffaf5')
 panel.alpha_composite(display.convert('RGBA'),(21,21))
 panel=panel.rotate(rot,Image.Resampling.BICUBIC,expand=True)
 shadow=Image.new('RGBA',panel.size,(0,0,0,0));shadow.putalpha(panel.getchannel('A').filter(ImageFilter.GaussianBlur(20)).point(lambda a:int(a*.20)))
 x,y=box[:2]
 hero.alpha_composite(shadow,(x+18,y+18));hero.alpha_composite(panel,(x,y))
hero.convert('RGB').save(OUT/'hero_originals_campaign.webp','WEBP',quality=87,method=6)
