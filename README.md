# Luz Celestia · V5 lista para Vercel

**Sitio terminado:** landing boutique estática bilingüe para el emprendimiento Luz Celestia, con exactamente seis productos reales. No usa backend ni base de datos. El único contacto para comprar es [@luzcelestia.ni](https://www.instagram.com/luzcelestia.ni/).

## Publicar en Vercel (recomendado: GitHub)

1. Descomprime el ZIP en tu computadora. **La carpeta `LUZ_CELESTIA_V5_VERCEL` es la raíz del proyecto.**
2. Sube el contenido de esa carpeta a un repositorio de GitHub (no subas el ZIP sin extraer).
3. Entra a [vercel.com/new](https://vercel.com/new), conecta GitHub y elige ese repositorio.
4. La configuración ya está en `vercel.json`. Comprueba que indique **Framework: Other**, **Build Command: `npm run build`**, **Output Directory: `dist`** y raíz del proyecto como `./`.
5. Haz clic en **Deploy**. Al finalizar, Vercel te mostrará el enlace público.
6. Prueba `/es/` y `/en/` en ese enlace, abre un producto, revisa su precio y verifica Instagram.

Si quieres **publicar directamente desde tu PC sin GitHub**:

```powershell
cd RUTA\A\LUZ_CELESTIA_V5_VERCEL
npm install -g vercel
vercel login
vercel --prod
```

Sigue las preguntas de Vercel; el archivo de configuración se encargará de indicar cómo construir y qué carpeta publicar. **No hay dominio público hasta que completes el despliegue**.

## Abrir la web en tu computadora

Instala Node.js 20 o superior. Abre una terminal en la carpeta del proyecto y ejecuta:

```powershell
npm run dev
```

Abre `http://localhost:4321/` en tu navegador. Para revisar el resultado compilado:

```powershell
npm run build
npm test
npm run preview
```

`dist/` ya trae una copia compilada de la web. Si modificas el catálogo o el diseño, ejecuta `npm run build` de nuevo.

## Qué contiene

- `src/catalog.json` — exactamente seis productos, precios y modalidades de consulta/preorden.
- `src/locales.json` — traducciones completas español/inglés.
- `src/style.css` y `src/app.js` — estilos, interacción y galería de detalle.
- `scripts/build.mjs` — construcción del HTML estático.
- `assets/logo/` — logo original y versión de contraste, sin cambiar su forma.
- `assets/productos/` — originales y recortes fieles.
- `dist/` — página estática resultante de la compilación.
- `vercel.json` — configuración de publicación automática.

## Reglas respetadas

- Solo seis productos; Vínculo US$2, otros cinco US$3 por preorden.
- Español e inglés; alternador ES/EN.
- Instagram oficial: `https://www.instagram.com/luzcelestia.ni/`.
- Sin carrito, pagos, formularios, registro, API, backend ni base de datos.
- El logo original y todas las fotografías originales se conservan. La versión de contraste del logo mejora la legibilidad sin cambiar composición o símbolos; los acercamientos son recortes de fotos reales.
- Nunca se inventan variantes o ángulos de cámara.

Después de publicar, puedes añadir tu dominio personalizado y una imagen Open Graph con URL absoluta cuando conozcas la URL final.
