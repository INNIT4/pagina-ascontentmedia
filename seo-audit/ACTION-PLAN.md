# Plan de Acción SEO — AS Content Media
**Sitio:** https://pagina-ascontentmedia.vercel.app/
**Fecha:** 2026-03-19
**Puntuación actual:** 36/100 | **Objetivo a 3 meses:** 65/100

---

## CRITICO — Implementar Inmediatamente (esta semana)

### C1. Crear robots.txt
**Archivo:** `/robots.txt` (en raíz del proyecto)
**Impacto:** Crawlabilidad, bloqueo de admin

```
User-agent: *
Allow: /
Disallow: /admin.html

Sitemap: https://pagina-ascontentmedia.vercel.app/sitemap.xml
```

---

### C2. Crear sitemap.xml
**Archivo:** `/sitemap.xml` (en raíz del proyecto)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pagina-ascontentmedia.vercel.app/</loc>
    <lastmod>2026-03-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

> Actualizar `<lastmod>` cada vez que se hagan cambios significativos al sitio.

---

### C3. Agregar Open Graph + Twitter Cards
**Archivo:** `index.html`, dentro del `<head>`, después del `<meta name="description">`

```html
<!-- Canonical -->
<link rel="canonical" href="https://pagina-ascontentmedia.vercel.app/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="AS Content Media">
<meta property="og:title" content="AS Content Media | Fotógrafo de Eventos en Sonora">
<meta property="og:description" content="Fotografía y video profesional para bodas, baby showers, quinceañeras y más eventos en Sonora, México. Reels para redes sociales incluidos.">
<meta property="og:url" content="https://pagina-ascontentmedia.vercel.app/">
<meta property="og:image" content="https://pagina-ascontentmedia.vercel.app/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="es_MX">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AS Content Media | Fotógrafo de Eventos en Sonora">
<meta name="twitter:description" content="Fotografía y video profesional para bodas, baby showers y más en Sonora, México.">
<meta name="twitter:image" content="https://pagina-ascontentmedia.vercel.app/og-image.jpg">
```

> Crear una imagen `og-image.jpg` de 1200x630px con el logo y una foto del portafolio.

---

### C4. Mejorar Title Tag y Meta Description
**Archivo:** `index.html` líneas 7 y 6

**Title actual:**
```html
<title>AS Content Media | Fotografía & Video</title>
```
**Title recomendado:**
```html
<title>AS Content Media | Fotógrafo de Eventos en Sonora, México</title>
```

**Meta description actual:**
```html
<meta name="description" content="AS Content Media - Fotografía y video profesional para eventos en Sonora. Bodas, baby showers, quinceañeras y más.">
```
**Meta description recomendada:**
```html
<meta name="description" content="Fotografía y video profesional para bodas, baby showers, XV años y más eventos en Sonora. Reels para redes sociales. Escríbenos por WhatsApp hoy.">
```

---

### C5. Agregar Schema JSON-LD (LocalBusiness + Photographer + WebSite + Services)
**Archivo:** `index.html`, antes del `</head>` (línea 13, después del link de stylesheet)

Pegar los siguientes **4 bloques** en orden:

#### Bloque 1 — LocalBusiness + Photographer (el más importante)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  "@id": "https://pagina-ascontentmedia.vercel.app/#business",
  "name": "AS Content Media",
  "description": "Fotografía y video profesional para eventos en Sonora. Bodas, baby showers, cumpleaños, quinceañeras, bautizos y más.",
  "url": "https://pagina-ascontentmedia.vercel.app/",
  "telephone": "+526471581483",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+526471581483",
    "contactType": "customer service",
    "availableLanguage": "Spanish"
  },
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Sonora",
    "addressCountry": "MX"
  },
  "areaServed": {
    "@type": "State",
    "name": "Sonora",
    "addressCountry": "MX"
  },
  "sameAs": [
    "https://www.instagram.com/ascontentmedia"
  ],
  "priceRange": "$$",
  "currenciesAccepted": "MXN",
  "image": "https://pagina-ascontentmedia.vercel.app/og-image.jpg",
  "knowsAbout": [
    "Event Photography",
    "Wedding Photography",
    "Videography",
    "Social Media Reels",
    "Baby Shower Photography"
  ]
}
</script>
```

#### Bloque 2 — WebSite
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://pagina-ascontentmedia.vercel.app/#website",
  "name": "AS Content Media",
  "url": "https://pagina-ascontentmedia.vercel.app/",
  "description": "Fotografía y video profesional para eventos en Sonora, México.",
  "inLanguage": "es-MX",
  "publisher": {
    "@id": "https://pagina-ascontentmedia.vercel.app/#business"
  }
}
</script>
```

#### Bloque 3 — Services (los 3 paquetes)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://pagina-ascontentmedia.vercel.app/#servicio-fotografia",
      "name": "Paquete Fotografía de Eventos",
      "description": "Sesión completa de fotografía para tu evento. Incluye fotografías editadas de alta calidad y galería digital. Bodas, baby showers, cumpleaños, bautizos y más en Sonora.",
      "provider": { "@id": "https://pagina-ascontentmedia.vercel.app/#business" },
      "areaServed": { "@type": "State", "name": "Sonora", "addressCountry": "MX" },
      "serviceType": "Event Photography",
      "url": "https://pagina-ascontentmedia.vercel.app/#servicios"
    },
    {
      "@type": "Service",
      "@id": "https://pagina-ascontentmedia.vercel.app/#servicio-foto-video-reel",
      "name": "Paquete Foto + Video + Reel",
      "description": "Fotografías editadas, video cinematográfico del evento y reel para redes sociales. El paquete más popular para bodas y eventos especiales en Sonora.",
      "provider": { "@id": "https://pagina-ascontentmedia.vercel.app/#business" },
      "areaServed": { "@type": "State", "name": "Sonora", "addressCountry": "MX" },
      "serviceType": "Event Photography and Videography",
      "url": "https://pagina-ascontentmedia.vercel.app/#servicios"
    },
    {
      "@type": "Service",
      "@id": "https://pagina-ascontentmedia.vercel.app/#servicio-video-reel",
      "name": "Paquete Video + Reel de Eventos",
      "description": "Video cinematográfico completo del evento y reel profesional para redes sociales con edición incluida. Disponible en Sonora, México.",
      "provider": { "@id": "https://pagina-ascontentmedia.vercel.app/#business" },
      "areaServed": { "@type": "State", "name": "Sonora", "addressCountry": "MX" },
      "serviceType": "Event Videography",
      "url": "https://pagina-ascontentmedia.vercel.app/#servicios"
    }
  ]
}
</script>
```

#### Bloque 4 — WebPage
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://pagina-ascontentmedia.vercel.app/#webpage",
  "name": "AS Content Media | Fotografía & Video para Eventos en Sonora",
  "description": "AS Content Media — fotografía y video profesional para bodas, baby showers, cumpleaños, bautizos, festivales y más en Sonora, México.",
  "url": "https://pagina-ascontentmedia.vercel.app/",
  "inLanguage": "es-MX",
  "isPartOf": { "@id": "https://pagina-ascontentmedia.vercel.app/#website" },
  "about": { "@id": "https://pagina-ascontentmedia.vercel.app/#business" }
}
</script>
```

> Validar en: https://search.google.com/test/rich-results y https://validator.schema.org/

> **Nota:** `FAQPage` no genera rich results en Google para sitios comerciales (desde agosto 2023), pero sí beneficia citaciones de ChatGPT y Gemini. Implementarlo solo si se agrega una sección FAQ visible en el HTML.

---

### C6. Agregar Favicon
**Archivo:** `index.html`, dentro del `<head>`

```html
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

> Crear favicon de 32x32px y apple-touch-icon de 180x180px con el logo "AS".

---

## ALTO — Esta semana / próximos 7 días

### A1. Registrar en Google Business Profile
**Costo:** Gratis | **Impacto:** Muy alto para búsquedas locales

1. Ir a `business.google.com`
2. Crear perfil: "AS Content Media"
3. Categoría: "Fotógrafo de bodas" + "Videógrafo"
4. Dirección: Sonora, México (sin dirección exacta si trabajan en múltiples ciudades)
5. Teléfono: 647-158-1483
6. Sitio web: la URL del sitio
7. Horario de atención
8. Subir fotos del portafolio

**Beneficio:** Aparece en Google Maps y en el "Local Pack" de resultados cuando alguien busca "fotógrafo de eventos en Sonora".

---

### A2. Configurar Google Search Console
**Costo:** Gratis | **Impacto:** Medición y diagnóstico

1. Ir a `search.google.com/search-console`
2. Agregar propiedad con la URL del sitio
3. Verificar mediante meta tag (agregar al `<head>`):
   ```html
   <meta name="google-site-verification" content="[TOKEN]">
   ```
4. Enviar sitemap: `https://pagina-ascontentmedia.vercel.app/sitemap.xml`
5. Revisar errores de indexación

---

### A3. Agregar Alt Text a Imágenes Dinámicas
**Archivo:** `js/main.js`

En la función `loadCovers()`, línea 115:
```js
// Antes
img.alt = '';
// Después
img.alt = `Portafolio de ${key} - AS Content Media Sonora`;
```

En la función `buildGalleryItem()`, líneas ~256 y ~260:
```js
// Para photos
img.alt = `Fotografía de ${eventMeta[currentKey]?.title || 'evento'} - AS Content Media`;
// Para thumbs de video
img.alt = `Video de ${eventMeta[currentKey]?.title || 'evento'} - AS Content Media Sonora`;
```

---

### A4. Corregir Contraste y Tamaños de Fuente (Accesibilidad / CWV)
**Archivo:** `css/style.css`

Elementos a corregir:
- `.hero__location`: cambiar a `rgba(244,239,233,0.55)` mínimo (de 0.2 a 0.55+)
- `.footer__copy`: cambiar a `rgba(244,239,233,0.45)` mínimo (de 0.25 a 0.45+)
- `.section-tag`: cambiar de `0.62rem` a `0.75rem`
- `.nav__link`: cambiar de `0.72rem` a `0.78rem`

Touch target del burger:
```css
.nav__burger {
  padding: 12px; /* aumentar de 4px a 12px para área 48x48px */
}
```

---

### A5. Agregar Contenido de Ciudades en el Sitio
En la sección Hero o Servicios, agregar texto visible que mencione ciudades específicas:

```html
<!-- Sugerencia para hero__location -->
<span class="hero__location">
  Hermosillo · Cd. Obregón · Sonora, México
</span>
```

---

## MEDIO — Próximas 4 semanas

### M1. Contratar Dominio Propio
**Opciones recomendadas:**
- `ascontentmedia.com.mx` (~$300 MXN/año)
- `ascontentmediasonora.com` (~$200 MXN/año)
- `fotografosonora.com` (keyword-rich, si está disponible)

Configurar el dominio en Vercel en: Settings → Domains.

---

### M2. Agregar Sección de Testimonios
Agregar una sección antes del contacto con 3–5 reseñas de clientes reales:

```html
<section class="testimonials" id="testimonios">
  <div class="container">
    <div class="section-head">
      <span class="section-tag">Lo que dicen nuestros clientes</span>
      <h2 class="section-title">Testimonios</h2>
    </div>
    <!-- Cards con nombre, reseña, tipo de evento -->
  </div>
</section>
```

También agregar `Review` Schema para cada testimonio.

---

### M3. Agregar Sección "Sobre Nosotros"
Incluir:
- Nombre y foto del fotógrafo (@anasofiaiba)
- Años de experiencia
- Filosofía de trabajo
- Equipamiento utilizado (si aplica)

Esto mejora E-E-A-T y conexión emocional con clientes.

---

### M4. Agregar FAQ Section
Al menos 5–7 preguntas frecuentes. Ejemplo:

```html
<section class="faq" id="faq">
  <details>
    <summary>¿Con cuánta anticipación debo reservar mi fecha?</summary>
    <p>Recomendamos reservar con al menos 4–6 semanas de anticipación para asegurar disponibilidad en tu fecha.</p>
  </details>
  <details>
    <summary>¿En cuánto tiempo recibo mis fotos y videos?</summary>
    <p>Las fotografías editadas se entregan en un plazo de 2–3 semanas. Los videos y reels en 3–4 semanas.</p>
  </details>
  <!-- más preguntas... -->
</section>
```

Agregar FAQPage Schema correspondiente.

---

### M5. Subir Contenido Real al Portafolio
El portafolio actualmente muestra "próximamente". Google no puede indexar imágenes que no existen. Prioridad:
1. Subir al menos 3–5 fotos/videos por categoría a Firestore
2. Usar URLs descriptivas en Firebase Storage
3. Asegurarse de que los covers carguen en menos de 1.5s (optimizar imágenes)

---

### M6. Crear og-image.jpg
Imagen de 1200x630px para compartir en redes sociales. Debe incluir:
- Logo AS Content Media
- Una foto atractiva del portafolio de fondo
- Tagline: "Fotografía & Video para Eventos · Sonora"

Herramienta gratuita: Canva.com

---

## BAJO — Backlog (próximos 3 meses)

### B1. Crear Páginas Dedicadas por Tipo de Evento
Para posicionarse en keywords específicas como "fotógrafo de bodas en Sonora", lo ideal es tener páginas dedicadas:
- `/bodas` — Fotografía y video para bodas en Sonora
- `/baby-shower` — Fotografía para baby showers
- `/quinceañeras` — etc.

Requiere cambio arquitectónico de single-page a multi-page.

---

### B2. Blog de Contenido
Artículos sugeridos:
- "¿Qué esperar del fotógrafo en tu boda? Guía completa"
- "10 momentos que no puedes perderte fotografiar en un baby shower"
- "¿Reel de bodas o video completo? ¿Qué conviene más?"
- "Cómo elegir al fotógrafo perfecto para tu evento en Sonora"

---

### B3. Registrar en Directorios de Bodas
- `bodas.com.mx`
- `matrimonio.com.mx`
- `zankyou.com.mx`
- `weddingwire.com.mx`

Cada listing genera un backlink de autoridad.

---

### B4. Agregar llms.txt
**Archivo:** `/llms.txt` (en raíz)

```
# AS Content Media

AS Content Media es un estudio de fotografía y video profesional en Sonora, México.
Especialista en bodas, baby showers, quinceañeras, bautizos, cumpleaños, eventos deportivos y festivales.

Servicios:
- Paquete Fotografía: sesión completa, fotos editadas y galería digital
- Paquete Foto + Video + Reel: fotos, video del evento y reel para redes sociales
- Paquete Video + Reel: video cinematográfico y reel profesional

Contacto: WhatsApp +52 647 158 1483 | Instagram: @ascontentmedia
Ubicación: Sonora, México
```

---

### B5. Agregar Google Analytics (GA4)
Para medir tráfico, conversiones y comportamiento de usuarios:
1. Crear propiedad en `analytics.google.com`
2. Agregar snippet antes de `</head>`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
3. Configurar evento de conversión: clic en botón de WhatsApp

---

## Resumen de Prioridades

| # | Acción | Impacto | Esfuerzo | Plazo |
|---|--------|---------|----------|-------|
| C1 | robots.txt | Alto | 5 min | HOY |
| C2 | sitemap.xml | Alto | 10 min | HOY |
| C3 | Open Graph + Twitter Cards | Alto | 30 min | HOY |
| C4 | Mejorar title + meta desc | Medio | 10 min | HOY |
| C5 | Schema JSON-LD | Alto | 45 min | HOY |
| C6 | Favicon | Medio | 15 min | HOY |
| A1 | Google Business Profile | MUY ALTO | 1 hora | Esta semana |
| A2 | Google Search Console | Alto | 30 min | Esta semana |
| A3 | Alt text en imágenes JS | Medio | 20 min | Esta semana |
| A4 | Mencionar ciudades en texto | Medio | 15 min | Esta semana |
| M1 | Dominio propio | Alto | $200-300 MXN/año | Mes 1 |
| M2 | Sección testimonios | Alto | 2 horas | Mes 1 |
| M3 | Sección "Sobre nosotros" | Alto | 1 hora | Mes 1 |
| M4 | FAQ section + schema | Medio | 2 horas | Mes 1 |
| M5 | Subir portafolio real | MUY ALTO | Variable | Mes 1 |
| M6 | og-image.jpg | Alto | 30 min | Mes 1 |
| B1 | Páginas por evento | Alto | 1-2 días dev | Mes 2-3 |
| B2 | Blog | Alto | Continuo | Mes 3+ |
| B3 | Directorios de bodas | Medio | 2 horas | Mes 2 |
| B4 | llms.txt | Bajo | 15 min | Mes 2 |
| B5 | Google Analytics GA4 | Alto | 30 min | Mes 1 |

**Implementando solo los items CRITICOS (C1–C6) + A1 + A2, la puntuación estimada sube a ~58/100.**
