# Luz Celestia — V11 boutique editorial

Sitio estático, bilingüe y preparado para Vercel. Exactamente seis piezas reales. Precios originales: US$2 para la pulsera de listón con medalla y US$3 para las otras cinco referencias, en modalidad preorden. Instagram es el único canal comercial.

## Ejecutar

Necesitás Node.js 20 o superior.

```
npm run build
npm test
npm run preview
```

Luego visitá `http://127.0.0.1:4321/`. El inicio abre inglés por defecto; el selector ES/EN guarda la preferencia elegida. La carpeta compilada es `dist/`.

## Publicar en el Vercel existente

Subí esta carpeta al repositorio GitHub ya conectado al proyecto Vercel. Se utiliza `vercel.json`: build `npm run build`, output `dist`. No hay que crear una base de datos, añadir secretos ni registrar servicios externos. Aprobá el despliegue antes de reemplazar la versión pública.

## Recursos visuales

`assets/productos/originales/` conserva las fotografías reales. `assets/productos/campaign-v10/` contiene seis composiciones nuevas y una portada construidas exclusivamente con esas fotos reales. No son ángulos fotográficos nuevos ni imágenes de piezas inventadas. Se incluye `scripts/create_campaign_v10.py` para regenerarlas.

Los archivos `PREVIEW_en_1440.png`, `PREVIEW_en_390.png` y `PREVIEW_es_390.png` son capturas locales de verificación. No sustituyen revisar la web en la URL pública después del despliegue.

## Límites respetados

No hay carrito, pagos, login, formulario, backend ni base de datos. Ningún vínculo comercial distinto a `https://www.instagram.com/luzcelestia.ni/`.
