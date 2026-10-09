# Actualizar el proyecto existente de Vercel

Este ZIP contiene la web implementada. No se publicó ni se modificó tu proyecto remoto.

1. Descomprimí el ZIP. Abrí la carpeta `luz-celestia`.
2. En Vercel abrí el proyecto que corresponde a **ceslestiani.vercel.app**. En Settings → Git identificá el repositorio conectado y su rama de producción. No creés otro proyecto.
3. Hacé una copia de respaldo del repositorio actual antes de reemplazarlo. Conservá `.git`, la conexión y cualquier configuración privada existente.
4. Copiá el contenido de `luz-celestia` a la raíz de ese repositorio, reemplazando los archivos de la versión anterior. Si Vercel tiene una **Root Directory** configurada, copiá dentro de esa carpeta. No dejés `luz-celestia/luz-celestia` anidado.
5. Para evitar mezclar versiones, reemplazá completas `src`, `scripts`, `assets` y `dist`. Las pruebas de `verification` pueden quedarse en el repositorio, pero no se publican: el build solo publica `dist`.
6. En tu terminal, desde la carpeta del proyecto, ejecutá `npm run build` y luego `npm test`. No hace falta instalar dependencias para compilar esta web.
7. En Vercel → Settings → Build and Deployment comprobá: **Framework Preset: Other**, **Build Command: npm run build**, **Output Directory: dist**, **Node.js: 20 o superior**. El archivo `vercel.json` ya establece build y salida. Si la configuración manual difiere, actualizala.
8. Guardá/subí los cambios al repositorio y a su rama de producción usando tu flujo habitual (GitHub Desktop, Git o web de GitHub). Vercel iniciará un despliegue nuevo. No subás solo el ZIP: el repositorio debe contener los archivos descomprimidos.
9. Esperá el estado Ready. Abrí tu dominio existente y probá `/en/`, `/es/`, las seis piezas y sus tres vistas, el desplegable de foto original, los botones de Instagram y ambos temas. Cambiá idioma y tema, recargá y comprobá que se conserven. El idioma guardado puede hacer que vuelvas a español: eso es normal.
10. Si aparece la versión anterior, verificá que el commit correcto esté desplegado y que Root Directory apunte a la carpeta correcta; después recargá con Ctrl+F5.

## Vista previa antes de producción

Si usás ramas, subí primero a una rama de prueba. Vercel generará una Preview. Revisá esa URL antes de integrar la rama en producción.

## Volver atrás

En Deployments elegí el último despliegue estable y usá la opción de rollback/promoción disponible en tu cuenta. También podés revertir el commit en el repositorio. Conservá el respaldo hasta revisar la nueva versión.

Las imágenes sociales apuntan al dominio existente. Si cambiás el dominio, actualizá los metadatos y el sitemap en `scripts/build.mjs`.
