# Kolbing Site

Proyecto estático accesible y modular para el sitio web de Kolbing.

## Estructura del proyecto

```
kolbing_site/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   ├── logo.svg              # Reemplazar con el logo oficial
│   ├── favicon.ico           # Reemplazar por el favicon real
│   ├── favicon-32.png        # Reemplazar por versión de 32x32 px
│   ├── apple-touch-icon.png  # Reemplazar por icono para iOS
│   └── img/                  # Carpeta para imágenes optimizadas
├── legal/
│   ├── privacy.html
│   └── terms.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Personalización rápida

1. **Logotipos e imágenes**: Sustituye los archivos de `/assets/` con versiones optimizadas (idealmente WebP o SVG). Mantén los mismos nombres o ajusta las rutas en el HTML.
2. **Copys y CTA**: Edita los textos directamente en `index.html`. Todo el contenido está en español.
3. **Colores y tipografías**: Cambia variables en `css/styles.css` (`:root`) para adaptar la paleta o la tipografía corporativa.
4. **Testimonios y secciones**: Añade o quita elementos duplicando los `<article>` en cada sección y asegurándote de mantener encabezados accesibles.

## Formularios y endpoints

- El archivo `js/script.js` usa la constante `FORM_ENDPOINT` como destino de la petición `fetch`. Reemplázala por la URL real de tu servicio (Formspree, Getform, API propia, etc.).
- Si el `fetch` falla, se activa un fallback `mailto:` con los datos del usuario.
- El formulario incluye honeypot, validaciones en cliente y mensajes de error accesibles.

## Accesibilidad

- Navegación por teclado con estilos `:focus-visible` visibles.
- Saltos de sección a través de la skip-link y encabezados jerárquicos.
- Control del menú móvil con estados `aria-expanded` y bloqueo del scroll.
- Slider de testimonios con autoplay pausado si `prefers-reduced-motion` está activo.
- Formularios con estados de error claros y atributos semánticos.

## SEO y metadatos

- `index.html` incluye meta descripción, etiquetas Open Graph y Twitter Card.
- `robots.txt` permite indexación y `sitemap.xml` declara las rutas clave.
- `site.webmanifest` y favicons listos para PWA y dispositivos móviles.

## Despliegue

1. Empaqueta la carpeta `kolbing_site/` y súbela a tu hosting estático (Netlify, Vercel, GitHub Pages, etc.).
2. Configura el servidor para servir `index.html` como archivo principal y habilita compresión gzip/brotli.
3. Asegura HTTPS y agrega encabezados de seguridad (`Content-Security-Policy`, `Strict-Transport-Security`, etc.).

## Mantenimiento continuo

- Revisa periódicamente los textos legales en `/legal/` para mantenerlos actualizados.
- Evalúa la accesibilidad con herramientas como Lighthouse o axe después de cada cambio.
- Actualiza las imágenes para mantener un peso reducido y revisa los `alt` descriptivos.
- Renueva los testimonios y casos de éxito al menos una vez por semestre para mantener el contenido fresco.
