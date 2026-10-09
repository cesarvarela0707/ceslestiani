"""V7 visual direction: photographic field notes, not invented product renders.
Six different layouts made ONLY from the original product photos and real crops.
No retouching changes the item's color, shape, material, or viewing angle.
Run once for artwork refresh. Not part of the production build.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageOps
import random, math

ROOT = Path(__file__).resolve().parents[1]
P = ROOT/'assets'/'productos'
OUT = P/'editorial-v7'
OUT.mkdir(parents=True, exist_ok=True)
S=1120
ITEMS = [
 ('pulseras_liston_medalla','#ECD8DC','#FAF1E9','wide',(-10,135,1010,1120)),
 ('cruces_blancas_doradas','#E8E2D8','#FEFBF4','stack',(200,270,970,1110)),
 ('cruces_corazon_rosa','#F4E4E5','#FAF8F2','full',(0,80,1320,1400)),
 ('pulseras_concha_dorada','#D7E5E4','#F6F3E9','split',(40,150,1090,1380)),
 ('pulsera_medalla_concha','#EACED4','#FAF3EF','hero',(140,230,1280,1430)),
 ('cruces_corazon_color','#E5E8E0','#FCFAF4','pane',(30,120,1170,1410)),
]

def rgb(h): return tuple(int(h[i:i+2],16) for i in (1,3,5))
def gradient(a,b):
    first, last=rgb(a),rgb(b)
    im=Image.new('RGB',(S,S)); pix=im.load(); rnd=random.Random(2027)
    for y in range(S):
        t=(y/S)**.72
        color=tuple(round(first[i]*(1-t)+last[i]*t) for i in range(3))
        for x in range(S):
            v=rnd.randint(-2,2)
            pix[x,y]=tuple(max(0,min(255,c+v)) for c in color)
    return im.convert('RGBA')

def crop_resize(im,w,h,kind='cover', focus=(.5,.5)):
    sc=max(w/im.width,h/im.height) if kind=='cover' else min(w/im.width,h/im.height)
    n=im.resize((round(im.width*sc),round(im.height*sc)),Image.Resampling.LANCZOS)
    x=max(0,min(n.width-w,round((n.width-w)*focus[0])))
    y=max(0,min(n.height-h,round((n.height-h)*focus[1])))
    return n.crop((x,y,x+w,y+h))

def card(canvas, photo, box, angle=0, frame=15, roundness=15, shadow=True):
    x,y,w,h=box
    paper=Image.new('RGBA',(w+2*frame,h+2*frame+16),'#FFFCF8')
    pic=crop_resize(photo,w,h,'cover')
    mask=Image.new('L',(w,h),0);ImageDraw.Draw(mask).rounded_rectangle((0,0,w,h),radius=max(4,roundness-7),fill=255)
    paper.paste(pic,(frame,frame),mask)
    m=Image.new('L',paper.size,0);ImageDraw.Draw(m).rounded_rectangle((0,0,paper.width-1,paper.height-1),radius=roundness,fill=255)
    paper.putalpha(m)
    if angle:paper=paper.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
    if shadow:
        shade=Image.new('RGBA',paper.size,(32,36,40,0));shade.putalpha(paper.getchannel('A').filter(ImageFilter.GaussianBlur(21)).point(lambda v:int(v*.24)))
        canvas.alpha_composite(shade,(x+14,y+18))
    canvas.alpha_composite(paper,(x,y))

def ellipse_crop(canvas, photo, box, tint='#FFFAF5'):
    x,y,w,h=box
    im=crop_resize(photo,w,h,'cover')
    mask=Image.new('L',(w,h),0); ImageDraw.Draw(mask).ellipse((0,0,w-1,h-1),fill=255)
    shade=Image.new('RGBA',(w+45,h+45),(30,35,36,0))
    sm=Image.new('L',(w+45,h+45),0);ImageDraw.Draw(sm).ellipse((10,10,w+20,h+20),fill=110)
    shade.putalpha(sm.filter(ImageFilter.GaussianBlur(16)))
    canvas.alpha_composite(shade,(x+10,y+14))
    circ=Image.new('RGBA',(w+16,h+16),tint)
    cm=Image.new('L',circ.size,0);ImageDraw.Draw(cm).ellipse((0,0,w+15,h+15),fill=255)
    circ.putalpha(cm)
    canvas.alpha_composite(circ,(x-8,y-8))
    overlay=Image.new('RGBA',(w,h),(0,0,0,0)); overlay.paste(im,(0,0),mask)
    canvas.alpha_composite(overlay,(x,y))
    ImageDraw.Draw(canvas).ellipse((x-8,y-8,x+w+8,y+h+8),outline=(255,250,245,210),width=5)

for i,(stem,bg,light,kind,region) in enumerate(ITEMS):
    canvas=gradient(bg,light)
    d=ImageDraw.Draw(canvas,'RGBA')
    # Structured editorial line-work sits OUTSIDE the photographs.
    d.arc((-250,-150,680,780),70,175,fill=(71,88,83,34),width=3)
    d.arc((350,300,1350,1300),250,345,fill=(97,76,87,28),width=3)
    d.line((80,1020,1040,1020),fill=(66,77,75,35),width=2)
    photo=Image.open(P/'originales'/f'{stem}.jpg').convert('RGB')
    detail=Image.open(P/'recortes'/f'{stem}_detalle.webp').convert('RGB')
    # Primary crop uses the same image pixels. Each layout has a different rhythm.
    if kind=='wide':
        card(canvas, photo,(86,128,858,735),angle=-1.2,frame=15)
        ellipse_crop(canvas,detail,(745,743,256,256))
    elif kind=='stack':
        card(canvas, photo,(102,140,695,852),angle=1.5,frame=18)
        card(canvas, detail,(735,74,284,322),angle=-4,frame=11)
    elif kind=='full':
        card(canvas,photo,(82,120,898,820),angle=.9,frame=14)
        ellipse_crop(canvas,detail,(75,765,260,260))
    elif kind=='split':
        card(canvas,photo,(90,126,700,860),angle=-.8,frame=18)
        card(canvas,detail,(738,172,270,365),angle=5,frame=10)
    elif kind=='hero':
        card(canvas,photo,(90,115,836,862),angle=-1.8,frame=15)
        ellipse_crop(canvas,detail,(720,748,252,252))
    else:
        card(canvas,photo,(120,112,794,856),angle=1.2,frame=16)
        card(canvas,detail,(26,664,265,280),angle=-5,frame=10)
    # A single tiny corner notch, distinct from stickers or stock mockups.
    d=ImageDraw.Draw(canvas,'RGBA')
    d.arc((950,45,1070,165),-10,100,fill=(83,67,75,110),width=3)
    path=OUT/f'{stem}_art.webp'
    canvas.convert('RGB').save(path,'WEBP',quality=88,method=6)
    print('CREATED',path.name)

cover=Image.new('RGB',(1200,630),'#f7ece7')
d=ImageDraw.Draw(cover)
d.rounded_rectangle((30,30,1170,600),radius=32,fill='#fff9f3')
for n,stem in enumerate(['pulsera_medalla_concha','cruces_corazon_rosa','pulseras_liston_medalla']):
    im=Image.open(OUT/f'{stem}_art.webp').convert('RGB').resize((455,455),Image.Resampling.LANCZOS)
    cover.paste(im,(85+n*285,79+n%2*32))
cover.save(OUT/'social_cover.webp','WEBP',quality=88,method=6)
print('CREATED social_cover.webp')
