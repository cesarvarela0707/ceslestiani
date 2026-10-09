# Verificación y límites reales

## Campaña visual

La campaña inicial conserva ocho escenas: un hero, una composición por cada referencia y un cierre HD dedicado al corazón rosado. Se usó la herramienta integrada de generación de imágenes, con las fotos originales como única fuente de verdad del producto. Los mockups se usaron solo para orientar luz, color y ambiente. No se representaron sus joyas ni se copiaron sus precios.

**No son fotografías nuevas tomadas con cámara ni nuevos ángulos físicos verificables.** Son ambientaciones generadas a partir de las fotos suministradas. La fidelidad se revisó visualmente, pero no se puede certificar identidad física a nivel de píxel: la IA reinterpreta microtexturas, reflejos, algunos bordes y detalles finos. Esta es una limitación real del requisito de fidelidad absoluta; no se presenta como resuelta. La revisión actual agrega doce imágenes HD nativas (1024 × 1536): seis detalles reconstruidos con IA y seis escenas en mano. Reemplazan los recortes de baja resolución del carrusel. Las tres vistas son Campaña, Detalle HD y En mano. La foto original completa queda en un desplegable independiente debajo de la galería. El sitio identifica las escenas recreadas con IA en ambos idiomas. Las manos ofrecen una composición ilustrativa: no sirven para deducir medidas reales.

## Comparación por referencia

Los seis archivos `verification/fidelity-*.jpg` muestran original y campaña lado a lado. Los seis `verification/new-fidelity-*.jpg` agregan la comparación original/detalle HD/en mano.

| Referencia | Elementos principales conservados en revisión visual | Diferencias y límite |
|---|---|---|
| Listón y cruz | Distribución de pulseras, colores visibles, medallas redondas y símbolo de cruz; sin conchas agregadas | Brillo del listón y relieve de medallas reinterpretados; consultar original para detalle fino |
| Cruz con borde dorado | Dos cruces claras, bordes dorados, cruz pequeña al centro y argollas | Reflejos y bordes más definidos en campaña; no mide ni certifica dimensiones |
| Cruz de corazón rosado | Cruces claras, corazón rosado con textura y orificios superiores | Mano retirada y apoyo ambientado; pequeñas texturas y piezas del fondo reinterpretadas |
| Listón y concha | Tres colores de listón, una concha dorada por pulsera y paso del listón por el centro | Se sustituyó madera/fondo por tela y piedra; detalles finos de conchas e iluminación reinterpretados |
| Dúo en listón rosado | Un listón rosado, medalla turquesa con cruz y una concha dorada al lado | Reflejos, brillo y pliegues finos reinterpretados; ningún adorno adicional |
| Cruz de corazón a color | Tres cruces claras, corazones azul, verde y vino, marco dorado y listones café | Mano retirada; dibujo fino del marco y textura de superficie reinterpretados |
| Hero | La referencia del dúo rosado, sus dos adornos y sus colores | Escena independiente ambientada, sin afirmar un nuevo ángulo real |

## Implementación

Reconstrucción de HTML generado, CSS e interacción. Paleta azul noche, rosa empolvado, celeste y dorado sobrio. Portada de campaña a todo ancho; apertura editorial de listones; dos cruces con tamaños y alturas diferentes; sección celeste para conchas; cierre con dúo y cruces de colores. Sin reutilizar el DOM ni el CSS de la landing anterior. El logo es el oficial suministrado; la cabecera y el pie usan el recorte original, sin recolorear ni redibujar. Un filtro SVG de presentación elimina el fondo casi blanco para mostrarlo sobre azul noche. Se descartó una prueba de extracción generada que dejaba residuos. Los colores originales del logo se conservan.

Galería: tres escenas, foto original desplegable, flechas, botones, swipe horizontal, ampliación, Escape, cierre, recuperación de foco y recorrido de Tab dentro del diálogo. La página y el diálogo permiten desplazamiento vertical según corresponda. Animaciones reducidas al solicitar `prefers-reduced-motion`.

Inglés y español completos, banderas SVG de Estados Unidos y España y cambio sin recargar mediante navegación local; selector visible y persistente; la primera visita comienza en inglés. Nombres comerciales descriptivos, sin historias o materiales inventados. US$2 con consulta de disponibilidad y cinco piezas de US$3 en preorden. Contacto exclusivamente por Instagram.

## Pruebas

`npm run build` y `npm test` validan compilación, seis referencias, precios, presencia de las 20 imágenes activas de campaña/detalle HD/en mano/hero/cierre, originales, ambos idiomas, rutas y contacto exclusivo. Los resultados del navegador se documentan en `verification/browser-results.json` una vez completados; las capturas provienen del sitio compilado y no de un mockup.

No se hizo despliegue remoto ni una compra/mensaje real en Instagram. Los enlaces comerciales se verifican por su URL y atributo, sin enviar mensajes. Las pruebas de touch se hacen mediante eventos de navegador; no sustituyen un ensayo en teléfono físico. No se afirma una auditoría exhaustiva de WCAG ni compatibilidad comprobada con Safari/Firefox.

### Detalles conservados de la versión aprobada

Logo oficial sobre azul, imagen HD de cierre, flechas circulares, estados de foco, transición de galería, indicador de lectura, copia de nombre con confirmación accesible y eliminación de la frase sobre feria escolar. Se conservan precios y contacto exclusivo por Instagram.

## Refinamiento solicitado: carrusel, controles y dos modos

Se mantiene la composición editorial aprobada y las seis fotos de campaña iniciales. Las doce nuevas imágenes se compararon visualmente con las seis fuentes; conservan las identidades principales. La medalla lavanda usada en sus vistas nuevas corresponde a una variante visible en el original, no a una variante inventada. Se preservan pares/tríos de cruces y conchas, colores de corazones y los dos dijes del dúo rosado. La reproducción de detalles pequeños y la escala relativa respecto a manos siguen siendo aproximaciones de IA, no una certificación de tamaño o textura.

El modo oscuro conserva el azul original. El claro usa champagne, rosé y salvia, con cabecera y pie azul para conservar la legibilidad del logo oficial. Preferencia en localStorage, aplicada antes de mostrar la página para evitar un destello de tema incorrecto. El selector de tema incluye sol/luna animados, nombre accesible y estado. Los CTA comerciales llevan cámara de Instagram, degradado, identificador de cuenta y enlace real; no simulan una cuenta ni agregan una compra interna.

Idiomas mediante fetch de los HTML locales precompilados y actualización del DOM/URL, sin recargar la página. Se conservan el tema y la posición de lectura; los eventos anteriores se limpian al cambiar. Hay enlaces normales como respaldo si falla esa navegación, y soporte para Atrás/Adelante. No se descargan librerías de traducción ni banderas remotas. Animaciones y transiciones respetan movimiento reducido.

Las pruebas actualizadas de Chromium cubren 24 combinaciones de tema, idioma y anchura: 360, 390, 430, 768, 1024 y 1440 px. Las capturas se guardan con el prefijo dark/light. Resultados efectivos en browser-results.json; el recorrido comprueba 144 diálogos, 432 vistas, precios, originales, zoom, teclado, recuperación de foco, ausencia de desbordamiento y enlaces. No se envían mensajes de Instagram ni se realiza un despliegue.

Resultado actual: PASS, 24 combinaciones y cero errores HTTP/JavaScript registrados en la suite principal. `controls-results.json` agrega móvil/escritorio con movimiento normal, cinco cambios sucesivos de idioma sin recarga, Atrás/Adelante, limpieza de eventos, estado accesible del tema y persistencia tras recargar. La matriz principal usa movimiento reducido para que las capturas sean estables.
