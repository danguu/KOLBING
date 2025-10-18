# Kolbing Landing Page

Sitio estático accesible y optimizado para la consultora inmobiliaria Kolbing. Todo el contenido está en español y preserva la identidad visual original.

## Estructura del proyecto

```
kolbing_site/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   ├── logo.svg
│   ├── favicon-32.png
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   └── img/
├── legal/
│   ├── privacy.html
│   └── terms.html
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

## Personalización

- **Texto y secciones:** edita el contenido directamente en `index.html` y en los archivos dentro de `legal/`.
- **Estilos:** ajusta colores y tipografías en `css/styles.css`. Las variables de color principales (`--accent`, `--accent-strong`) preservan la paleta Kolbing.
- **JavaScript:** la lógica de accesibilidad, slider y formulario vive en `js/script.js`. Allí puedes definir un endpoint en el atributo `data-endpoint` del formulario o mantener el fallback `mailto:`.

## Activos gráficos

Las rutas de iconos e imágenes ya están configuradas, pero no se incluyen binarios en este repositorio. Sube los siguientes archivos manualmente al directorio `assets/`:

- `assets/logo.svg`: logotipo oficial en formato vectorial.
- `assets/favicon-32.png`: favicon de 32×32 px.
- `assets/favicon.ico`: favicon multipropósito.
- `assets/apple-touch-icon.png`: icono de 180×180 px para dispositivos iOS.
- `assets/img/`: imágenes optimizadas en `.webp` (por ejemplo `hero-kolbing.webp`, logotipos de aliados, fotografías de equipo, etc.).
- `assets/fonts/kolbing-sans-regular.woff2`: tipografía principal en WOFF2 si deseas usar una fuente personalizada.

## Accesibilidad y rendimiento

- Navegación totalmente accesible con soporte para teclado, lectores de pantalla y preferencia de movimiento reducido.
- Imágenes configuradas con `loading="lazy"` y `decoding="async"`.
- Formularios con validación personalizada y mensajes accesibles (`aria-live`).
- Metadatos Open Graph, Twitter Cards y JSON-LD para SEO.

## Despliegue

1. Sube la carpeta `kolbing_site` a tu repositorio.
2. Publica en GitHub Pages, Netlify o cualquier servicio de hosting estático apuntando al archivo `index.html`.
3. Asegúrate de colocar los activos gráficos mencionados anteriormente en la ruta `assets/` antes de desplegar.

### GitHub Pages

- En GitHub, activa **Pages** desde la configuración del repositorio.
- Selecciona la rama de despliegue (`main` o `gh-pages`) y la carpeta raíz (`/`).
- Después del primer build, verifica que `https://<usuario>.github.io/<repositorio>/` cargue correctamente.

### Otros hosts (Netlify, Vercel, etc.)

- Arrastra y suelta la carpeta en la plataforma o configura un pipeline para desplegarla.
- Define `index.html` como archivo de entrada.
- Habilita redirecciones a `/index.html` si necesitas soporte para rutas limpias.

## Desarrollo local

Solo necesitas un servidor estático (por ejemplo, `npx serve kolbing_site`). Los estilos y scripts no requieren compilación adicional.

---

Creado con foco en accesibilidad WCAG AA, SEO y rendimiento superior a 95 en Lighthouse.
