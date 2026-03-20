# Plan de Acción SEO — AS Content Media
**Sitio:** https://pagina-ascontentmedia.vercel.app/
**Fecha:** 2026-03-19 (v2 — post fixes críticos)
**Puntuación actual:** 54/100 | **Objetivo a 3 meses:** 72/100

> **Nota:** Los items C1–C6 del plan v1 ya están implementados. Este plan parte del estado actual.

---

## ✅ YA IMPLEMENTADO (desde v1)

- [x] robots.txt con Disallow /admin.html y Sitemap declarado
- [x] sitemap.xml con homepage
- [x] Canonical tag
- [x] Open Graph (og:type, og:title, og:description, og:url, og:image, og:locale)
- [x] Twitter Card (summary_large_image)
- [x] JSON-LD: LocalBusiness + Photographer + WebSite + Service×3 + WebPage
- [x] Title: "AS Content Media | Fotógrafo de Eventos en Sonora, México"
- [x] Meta description con keywords + CTA
- [x] Favicon + apple-touch-icon
- [x] Preconnect Google Fonts + font-display:swap
- [x] theme-color

---

## CRÍTICO — Esta semana (impacto inmediato)

### C1. Verificar que og-image.jpg exista en Vercel

**Problema:** La URL `https://pagina-ascontentmedia.vercel.app/og-image.jpg` está declarada en OG y Twitter Card pero el archivo no está en el repo local.

**Acción:**
1. Crear una imagen 1200×630px (Canva.com es gratis)
   - Fondo: foto atractiva del portafolio
   - Logo: "AS CONTENT MEDIA" centrado
   - Subtítulo: "Fotografía & Video · Sonora, México"
2. Guardar como `og-image.jpg` en la raíz del proyecto
3. Push a Vercel y verificar: `curl -I https://pagina-ascontentmedia.vercel.app/og-image.jpg`

**Impacto:** Previews en WhatsApp, Facebook e Instagram cuando se comparte el link.

---

### C2. Alt Text en Imágenes Dinámicas (JS)

**Archivo:** `js/main.js`

**En `loadCovers()` (línea ~118):**
```js
// ANTES
img.alt = '';
// DESPUÉS
img.alt = `Portafolio de ${key} — AS Content Media Sonora`;
```

**En `buildGalleryItem()` (línea ~259 para fotos):**
```js
// ANTES
img.alt = '';
// DESPUÉS
img.alt = `Fotografía de ${eventMeta[key]?.title || 'evento'} — AS Content Media`;
```

**En `buildGalleryItem()` (~línea 243 para thumbs de video):**
```js
// ANTES
img.alt = '';
// DESPUÉS
img.alt = `Video de ${eventMeta[key]?.title || 'evento'} — AS Content Media Sonora`;
```

**Impacto:** Accesibilidad + indexación de imágenes del portafolio cuando se suban a Firestore.

---

### C3. Agregar Ciudad Principal al HTML lang y Schema

**1. Cambiar `lang` attribute en index.html línea 2:**
```html
<!-- ANTES -->
<html lang="es">
<!-- DESPUÉS -->
<html lang="es-MX">
```

**2. Agregar `addressLocality` al schema `#business`:**
```json
"address": {
  "@type": "PostalAddress",
  "addressLocality": "Hermosillo",
  "addressRegion": "Sonora",
  "addressCountry": "MX"
},
"openingHours": "Mo-Su 08:00-20:00",
"geo": {
  "@type": "GeoCoordinates",
  "latitude": 29.0729,
  "longitude": -110.9559
}
```

**Impacto:** Mejor señal geográfica para búsquedas locales en Hermosillo.

---

### C4. Actualizar Copyright

**Archivo:** `index.html`, línea 465:
```html
<!-- ANTES -->
&copy; 2025 AS Content Media
<!-- DESPUÉS -->
&copy; 2026 AS Content Media
```

---

## ALTO — Esta semana (1–7 días)

### A1. Registrar Google Business Profile

**Costo:** Gratis | **Impacto:** MUY ALTO para búsquedas locales

1. Ir a `business.google.com`
2. Crear perfil: "AS Content Media"
3. Categoría principal: "Fotógrafo de bodas" | Categoría secundaria: "Videógrafo"
4. Área de servicio: Hermosillo, Cd. Obregón, Navojoa, Guaymas (sin dirección fija si aplica)
5. Teléfono: 647-158-1483
6. Sitio web: la URL del sitio
7. Subir al menos 10 fotos del portafolio
8. Pedir reseñas a los primeros 5 clientes

**Beneficio:** Aparece en Google Maps y en el "Local Pack" de resultados para "fotógrafo de eventos en Sonora".

Una vez creado, agregar la URL de Google Maps al schema `sameAs`:
```json
"sameAs": [
  "https://www.instagram.com/ascontentmedia",
  "https://g.page/as-content-media"          // ← agregar
]
```

---

### A2. Configurar Google Search Console

**Costo:** Gratis | **Impacto:** Fundamental para medir rendimiento SEO

1. Ir a `search.google.com/search-console`
2. Agregar propiedad "URL prefix": `https://pagina-ascontentmedia.vercel.app/`
3. Verificar con meta tag:
   ```html
   <meta name="google-site-verification" content="[TOKEN-QUE-DA-GSC]">
   ```
4. Enviar sitemap: `https://pagina-ascontentmedia.vercel.app/sitemap.xml`
5. Revisar errores de cobertura de indexación
6. Solicitar indexación manual de la homepage

---

### A3. Agregar Ciudades Específicas en Texto Visible

**Archivo:** `index.html` — El elemento `.hero__location` (línea ~233):
```html
<!-- ANTES -->
<span class="hero__location">
  <svg>...</svg>
  Sonora, México
</span>

<!-- DESPUÉS -->
<span class="hero__location">
  <svg>...</svg>
  Hermosillo &nbsp;·&nbsp; Cd. Obregón &nbsp;·&nbsp; Sonora, México
</span>
```

**Impacto:** Activa búsquedas locales específicas como "fotógrafo de eventos en Hermosillo".

---

### A4. Correcciones de Accesibilidad

**Archivo:** `css/style.css`

```css
/* Contraste del texto de ubicación (de 0.2 a 0.55) */
.hero__location {
  color: rgba(244, 239, 233, 0.55);
}

/* Contraste del footer copyright (de 0.25 a 0.45) */
.footer__copy {
  color: rgba(244, 239, 233, 0.45);
}

/* Tamaño mínimo de fuente */
.section-tag {
  font-size: 0.75rem;  /* de 0.62rem */
}
.hero__tag {
  font-size: 0.75rem;  /* de 0.68rem */
}

/* Touch target del burger (mínimo 48×48px) */
.nav__burger {
  padding: 12px;
}
```

---

## MEDIO — Próximas 4 semanas

### M1. Contratar Dominio Propio

**Opciones recomendadas:**
- `ascontentmedia.com.mx` (~$300 MXN/año)
- `ascontentmediasonora.com` (~$250 MXN/año)

**Pasos:**
1. Registrar en GoDaddy, Namecheap o el registrador preferido
2. En Vercel → Settings → Domains → Agregar dominio
3. Actualizar **todos** los canónicos, OG tags y schemas con el nuevo dominio
4. Configurar redirect 301 de vercel.app → dominio propio
5. Actualizar sitemap.xml con nuevo dominio
6. Volver a registrar en Google Search Console con el nuevo dominio

**Impacto:** Brand authority, Domain Authority propio, confianza del usuario.

---

### M2. Sección de Testimonios

Agregar antes de la sección `#contacto`:

```html
<section class="testimonials" id="testimonios">
  <div class="container">
    <div class="section-head reveal">
      <span class="section-tag">Lo que dicen</span>
      <h2 class="section-title">Nuestros clientes</h2>
    </div>
    <div class="testimonials__grid">
      <div class="testimonial-card reveal">
        <p class="testimonial-card__text">"[Reseña real del cliente]"</p>
        <div class="testimonial-card__author">
          <strong>[Nombre]</strong>
          <span>Boda en Hermosillo, Sonora</span>
        </div>
      </div>
      <!-- Repetir para 3–5 testimonios -->
    </div>
  </div>
</section>
```

También agregar `AggregateRating` al schema `#business`:
```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "5",
  "reviewCount": "12",
  "bestRating": "5",
  "worstRating": "1"
}
```

**Nota:** Google puede penalizar si el `reviewCount` no refleja reseñas reales verificables.

---

### M3. Sección "Sobre Nosotros" / "Sobre Ana Sofía"

Agregar entre portafolio y contacto (al menos 200 palabras):

```html
<section class="about" id="nosotros">
  <div class="container">
    <div class="about__content reveal">
      <span class="section-tag">Detrás del lente</span>
      <h2 class="section-title">Sobre AS Content Media</h2>
      <p>
        Soy Ana Sofía, fotógrafa y videógrafa de eventos en Sonora, México.
        Desde [año], he capturado más de [X] bodas, baby showers, cumpleaños
        y eventos especiales a lo largo de Hermosillo, Ciudad Obregón y todo
        el estado de Sonora...
      </p>
      <!-- 150+ palabras más sobre su estilo, filosofía, equipo -->
    </div>
  </div>
</section>
```

**Impacto E-E-A-T:** +15 puntos en Experience, +12 en Expertise.

---

### M4. Sección FAQ con Schema

Al menos 5 preguntas frecuentes. Agregar como sección colapsable:

```html
<section class="faq" id="faq">
  <div class="container">
    <div class="section-head reveal">
      <span class="section-tag">Preguntas frecuentes</span>
      <h2 class="section-title">¿Tienes dudas?</h2>
    </div>
    <div class="faq__list">
      <details class="faq__item reveal">
        <summary>¿Con cuánta anticipación debo reservar mi fecha?</summary>
        <p>Recomendamos reservar con al menos 4–6 semanas de anticipación para garantizar disponibilidad, especialmente en temporada alta (mayo–diciembre).</p>
      </details>
      <details class="faq__item reveal">
        <summary>¿En cuánto tiempo recibo mis fotos y videos?</summary>
        <p>Las fotografías editadas se entregan en un plazo de 2–3 semanas. Los videos y reels profesionales en 3–4 semanas después del evento.</p>
      </details>
      <details class="faq__item reveal">
        <summary>¿Trabajan fuera de Hermosillo?</summary>
        <p>Sí, cubrimos todo el estado de Sonora: Hermosillo, Ciudad Obregón, Navojoa, Guaymas, Cajeme y más. Consultar disponibilidad y costo de traslado.</p>
      </details>
      <details class="faq__item reveal">
        <summary>¿Qué incluye la galería digital?</summary>
        <p>La galería digital incluye todas las fotografías editadas en alta resolución, accesibles desde cualquier dispositivo por 12 meses.</p>
      </details>
      <details class="faq__item reveal">
        <summary>¿Tienen paquetes personalizados?</summary>
        <p>Sí. Escríbenos por WhatsApp y diseñamos un paquete a la medida de tu evento y presupuesto.</p>
      </details>
    </div>
  </div>
</section>
```

Agregar el schema FAQPage correspondiente en `index.html`.

**Impacto:** Contenido citable para AI Search, +80 palabras indexables por pregunta.

---

### M5. Subir Contenido Real al Portafolio

El portafolio actualmente muestra "próximamente". Prioridad:
1. Subir mínimo 5–8 fotos por categoría a Firebase Storage
2. Crear docs en Firestore colección `portafolio` con `cover` y `items`
3. Asegurar que las imágenes estén optimizadas (WebP, < 200KB para covers, < 500KB para galería)
4. URLs descriptivas en Storage: `bodas/boda-hermosillo-2025-001.webp`

---

### M6. Agregar Google Analytics GA4

```html
<!-- Antes de </head> en index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Configurar evento de conversión: clic en botones WhatsApp (`.btn` con href `wa.me`).

---

### M7. Teléfono Visible como Texto

Agregar el número visible en el footer o en la sección de contacto:
```html
<a href="tel:+526471581483" class="contact__phone">
  +52 647 158 1483
</a>
```

---

## BAJO — Backlog (2–3 meses)

### B1. Crear Páginas Dedicadas por Tipo de Evento

Para posicionarse en keywords específicas con alto volumen:
- `/bodas` — "Fotógrafo de bodas en Sonora"
- `/baby-shower` — "Fotografía para baby shower en Hermosillo"
- `/quinceañeras` — "Fotografía de quinceañeras en Sonora"

Requiere migración de SPA a multi-page (o añadir rutas con un bundler).

### B2. Blog de Contenido

Artículos con keywords de cola larga:
- "¿Qué esperar del fotógrafo en tu boda? Guía para parejas en Sonora"
- "10 momentos que no pueden faltar en la foto de un baby shower"
- "¿Reel de boda o video completo? ¿Qué conviene más?"

### B3. Registrar en Directorios de Bodas

- `bodas.com.mx`
- `matrimonio.com.mx`
- `zankyou.com.mx`
- `weddingwire.com.mx`

Cada listing genera un backlink de autoridad + señal local.

### B4. Agregar llms.txt

```
# AS Content Media

Fotografía y video profesional para eventos en Sonora, México.
Especialistas en bodas, baby showers, quinceañeras, bautizos, cumpleaños, festivales y deportes.

Servicios:
- Paquete Fotografía: sesión completa, fotos editadas, galería digital
- Paquete Foto + Video + Reel: fotos + video cinematográfico + reel para redes
- Paquete Video + Reel: video del evento + reel profesional

Cobertura: Hermosillo, Ciudad Obregón, Navojoa, Guaymas y todo Sonora
Contacto: WhatsApp +52 647 158 1483 | Instagram: @ascontentmedia
```

### B5. Canal de YouTube

Subir reels y highlights de eventos con títulos descriptivos como:
- "Video de boda en Hermosillo Sonora 2026 — AS Content Media"
- "Baby Shower en Ciudad Obregón — Fotografía y Video"

YouTube tiene correlación ~0.737 con citas en AI Search (la más alta de todas las plataformas).

---

## Resumen Ejecutivo de Prioridades

| # | Acción | Impacto | Esfuerzo | Plazo |
|---|--------|---------|----------|-------|
| C1 | Crear og-image.jpg | Alto | 30 min | HOY |
| C2 | Alt text en imágenes JS | Medio | 20 min | HOY |
| C3 | lang="es-MX" + schema city | Medio | 10 min | HOY |
| C4 | Actualizar copyright 2026 | Bajo | 1 min | HOY |
| A1 | Google Business Profile | MUY ALTO | 1 hora | Esta semana |
| A2 | Google Search Console | Alto | 30 min | Esta semana |
| A3 | Agregar ciudades en texto | Medio | 10 min | Esta semana |
| A4 | Fixes de accesibilidad | Medio | 20 min | Esta semana |
| M1 | Dominio propio | Alto | $250–300 MXN/año | Mes 1 |
| M2 | Sección testimonios | Alto | 2 horas | Mes 1 |
| M3 | Sección "Sobre nosotros" | Alto | 1 hora | Mes 1 |
| M4 | FAQ section + schema | Medio | 2 horas | Mes 1 |
| M5 | Subir portafolio real | MUY ALTO | Variable | Mes 1 |
| M6 | Google Analytics GA4 | Alto | 30 min | Mes 1 |
| M7 | Teléfono visible como texto | Bajo | 5 min | Mes 1 |
| B1 | Páginas por evento | Alto | 1–2 días dev | Mes 2–3 |
| B2 | Blog de contenido | Alto | Continuo | Mes 3+ |
| B3 | Directorios de bodas | Medio | 2 horas | Mes 2 |
| B4 | llms.txt | Bajo | 15 min | Mes 2 |
| B5 | Canal de YouTube | MUY ALTO | Variable | Mes 2–3 |

**Implementando C1–C4 + A1 + A2 + A3 + A4, la puntuación estimada sube a ~63/100.**
**Con M1–M7 completos, el objetivo de 72/100 es alcanzable en 3 meses.**
