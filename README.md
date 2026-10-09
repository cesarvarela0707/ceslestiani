# Luz Celestia — boutique editorial

Sitio estático bilingüe de accesorios católicos. Seis referencias, precios US$2/US$3 y contacto exclusivo por Instagram. Sin dependencias de ejecución ni servicios externos.

## Ejecutar

Con Node.js 20 o superior:

```
npm run build
npm test
npm run preview
```

Abrir http://localhost:4321. El primer ingreso abre inglés y el diseño azul oscuro. Los controles EN 🇺🇸 / ES 🇪🇸 cambian el idioma sin recargar; idioma y tema se conservan en el navegador. También se puede entrar directamente a /es/ o /en/.

## Archivos

- `src/`: catálogo, textos, CSS e interacción.
- `scripts/build.mjs`: genera las dos versiones y limpia dist antes de compilar.
- `assets/campaign/`: hero, cierre, seis escenas elegantes, seis detalles HD y seis escenas en mano.
- `assets/originals/`: las seis fotos reales sin modificar.
- `assets/logo/`: logo oficial y recorte del mismo para cabecera/pie; filtro SVG de fondo en la presentación, sin redibujar ni recolorear.
- `dist/`: sitio compilado, listo para servir.
- `verification/`: comparación visual, pruebas y capturas cuando se hayan realizado.

Leer `VERIFICACION_Y_FIDELIDAD.md` para distinguir la campaña ambientada de las fotos reales. Leer `ACTUALIZAR_VERCEL.md` para reemplazar la versión existente.

Dos temas: azul noche original y champagne/rosé claro, manteniendo el logo sobre azul. Instagram con icono y degradado; controles suaves y soporte de movimiento reducido. La galería conserva tres escenas útiles y muestra la foto original en un desplegable separado.

Las capturas y resultados del navegador están en `verification/`. Las pruebas de navegador necesitan Playwright y Chromium instalados; no son necesarios para compilar o alojar el sitio. El recorrido principal captura con movimiento reducido para estabilizar las comparaciones; `controls-review.mjs` comprueba interacciones con movimiento normal, cambios repetidos de idioma, historial y persistencia.
