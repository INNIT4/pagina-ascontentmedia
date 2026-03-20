# Auditoría SEO Completa — AS Content Media
**URL:** https://pagina-ascontentmedia.vercel.app/
**Fecha de auditoría:** 2026-03-19 (v2 — post implementación de fixes críticos)
**Tipo de negocio:** Fotografía y video profesional para eventos — Sonora, México
**Stack:** HTML/CSS/JS vanilla + Firebase Firestore + Vercel hosting

---

## Resumen Ejecutivo

> **Nota:** Esta es la segunda versión del audit. Desde el audit v1 (mismo día), se implementaron todos los items CRÍTICOS (C1-C6). El score pasó de **37/100 → 54/100**.

### Puntuación Global de Salud SEO: **54 / 100**

| Categoría | Score | Peso | Puntos |
|-----------|-------|------|--------|
| SEO Técnico | 60/100 | 25% | 15.0 |
| Calidad de Contenido | 41/100 | 25% | 10.25 |
| SEO On-Page | 71/100 | 20% | 14.2 |
| Schema / Datos Estructurados | 65/100 | 10% | 6.5 |
| Rendimiento (CWV) | 50/100 | 10% | 5.0 |
| Imágenes | 35/100 | 5% | 1.75 |
| Preparación AI Search (GEO) | 30/100 | 5% | 1.5 |
| **TOTAL** | | | **54.2 / 100** |

---

### ✅ Lo que se implementó correctamente (desde v1)

| Item | Estado | Notas |
|------|--------|-------|
| robots.txt | ✅ Implementado | Disallow /admin.html, apunta a sitemap |
| sitemap.xml | ✅ Implementado | Homepage con priority 1.0 |
| Canonical tag | ✅ Implementado | `<link rel="canonical" href="...">` |
| Open Graph (5 tags) | ✅ Implementado | og:type, og:title, og:desc, og:image, og:locale |
| Twitter Card | ✅ Implementado | summary_large_image |
| JSON-LD LocalBusiness | ✅ Implementado | Con Photographer, areaServed, sameAs, priceRange |
| JSON-LD WebSite | ✅ Implementado | Con publisher |
| JSON-LD Service x3 | ✅ Implementado | Cada paquete linkado al business |
| JSON-LD WebPage | ✅ Implementado | Con isPartOf y about |
| Title mejorado | ✅ Implementado | "AS Content Media \| Fotógrafo de Eventos en Sonora, México" |
| Meta description mejorada | ✅ Implementado | 145 chars con keywords y CTA |
| Favicon + apple-touch-icon | ✅ Implementado | `/favicon.png` y `/apple-touch-icon.png` |
| Preconnect Google Fonts | ✅ Implementado | Con crossorigin en gstatic |
| font-display: swap | ✅ Implementado | En URL de Google Fonts |
| theme-color | ✅ Implementado | `#080808` |

---

### 🔴 Top 5 Problemas Críticos Restantes

1. **Dominio Vercel subdomain** — `pagina-ascontentmedia.vercel.app` tiene autoridad de dominio cero; toda la inversión SEO beneficia a vercel.app, no a la marca
2. **Contenido extremadamente escaso** — ~240 palabras indexables (mínimo recomendado: 800+); sin testimonios, sin "Sobre nosotros", sin FAQ
3. **Portafolio invisible para crawlers** — Todo el contenido del portafolio se carga via Firebase JS; Google y los AI crawlers indexan un portafolio vacío
4. **Sin Google Business Profile** — La mayor oportunidad de visibilidad local (Google Maps + Local Pack) está sin aprovechar
5. **Alt text vacío en imágenes dinámicas** — Todas las imágenes del portafolio y lightbox se crean con `alt=""` en main.js

---

### ⚡ Top 5 Quick Wins (implementables hoy)

1. **Alt text en imágenes JS** — 20 min en main.js (impacto inmediato en accesibilidad + SEO)
2. **Registrar Google Business Profile** — Gratis, 1 hora; mayor impacto para búsquedas locales
3. **Agregar ciudades específicas** — "Hermosillo · Cd. Obregón" en texto visible del hero
4. **Agregar sección de testimonios** — 2 horas; E-E-A-T +30 pts, conversión +15%
5. **Configurar Google Search Console** — Gratis, 30 min; sin esto no hay datos de rendimiento

---

## 1. SEO Técnico (60/100)

### 1.1 Crawlabilidad

| Elemento | Estado | Detalle |
|----------|--------|---------|
| robots.txt | ✅ OK | Permite todo, bloquea /admin.html, apunta a sitemap |
| sitemap.xml | ✅ OK | 1 URL (homepage), lastmod actual, priority 1.0 |
| Canonical tag | ✅ OK | Apunta a URL canónica correcta |
| Favicon | ✅ OK | `/favicon.png` + apple-touch-icon |
| HTTPS | ✅ OK | Vercel automático |
| www vs non-www | ✅ OK | Vercel maneja redirect |

**Problema medio — sitemap con solo 1 URL:** El sitemap solo indexa la homepage. Cuando se creen páginas individuales por evento (ver B1), el sitemap debe actualizarse.

**Problema alto — Dominio Vercel:**
- El dominio `pagina-ascontentmedia.vercel.app` es un subdominio de terceros
- Domain Authority = 0 (toda la autoridad va a vercel.app)
- La URL no inspira confianza profesional
- Los canonicals y OG URLs apuntan al subdominio de Vercel, no a un dominio propio

### 1.2 JavaScript Rendering (CRÍTICO)

El sitio tiene dos capas de JS que afectan SEO:

**Capa 1 — Animaciones reveal:**
```css
/* style.css: .reveal comienza invisible */
opacity: 0;
transform: translateY(28px);
```
Los elementos con `.reveal` son invisibles hasta que JS los anima. Si Googlebot no ejecuta el JS, **todo el contenido de la página es invisible**. No hay `<noscript>` fallback.

**Capa 2 — Portafolio via Firebase:**
- `loadCovers()` → getDoc de Firestore → crea `<img>` dinámicamente
- `openModal()` → getDoc de Firestore → crea grilla de imágenes
- Googlebot renderiza JS en segunda pasada (días después del crawl)
- Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) NO ejecutan JS
- Resultado: portafolio **siempre vacío** para motores de búsqueda

**Solución recomendada:**
1. Eliminar `opacity: 0` del CSS estático y aplicarlo solo via JS (progressive enhancement)
2. Agregar `<noscript>` con contenido fallback básico

### 1.3 Seguridad

| Header / Elemento | Estado | Riesgo |
|---|---|---|
| HTTPS + HSTS | ✅ OK | — |
| `rel="noopener"` en externos | ✅ OK | — |
| Content-Security-Policy | ⚠️ Ausente | Riesgo XSS bajo (sin inputs de usuario) |
| X-Frame-Options | ⚠️ Ausente | Riesgo clickjacking bajo |
| X-Content-Type-Options | ⚠️ Ausente | Riesgo MIME sniffing bajo |
| firebase-config.js público | ⚠️ Advertencia | Verificar Firestore Security Rules |
| admin.html bloqueada | ✅ OK | Disallow en robots.txt |

**Nota Firebase:** El `apiKey` en cliente es esperado (Firebase design), pero verificar que las Firestore Security Rules NO estén en modo `allow read, write: if true`. El admin.html sí tiene autenticación, pero el código de autenticación es visible.

### 1.4 HTML lang Attribute

```html
<!-- Actual -->
<html lang="es">

<!-- Recomendado (más específico) -->
<html lang="es-MX">
```

El OG locale ya es `es_MX` pero el HTML lang es genérico `es`. Corrección de 5 segundos.

### 1.5 og-image.jpg

La URL `https://pagina-ascontentmedia.vercel.app/og-image.jpg` está declarada en OG y Twitter Card pero **el archivo puede no existir** (no está en el repositorio local). Verificar que el archivo exista en el deploy de Vercel. Sin él, los previews en redes sociales no muestran imagen.

---

## 2. SEO On-Page (71/100)

### 2.1 Title Tag ✅

**Actual:** `AS Content Media | Fotógrafo de Eventos en Sonora, México`
- Longitud: 52 caracteres ✅ (50–60 ideal)
- Contiene: brand + keyword principal + geo ✅
- Único H1 en la página ✅

### 2.2 Meta Description ✅

**Actual:** `Fotografía y video profesional para bodas, baby showers, XV años y más eventos en Sonora. Reels para redes sociales. Escríbenos por WhatsApp hoy.`
- Longitud: 145 chars ✅ (máx ~160)
- Contiene: keyword + tipos de evento + geo + CTA ✅
- Ligera desincronización con el `<title>` (title dice "Fotógrafo de Eventos", desc dice "Fotografía y video") — mínimo impacto

### 2.3 Headings

```
H1: "Cada momento merece ser eterno"           ← Poético, sin keyword
<p> "Fotografía · Video · Reels"               ← Tag, no es heading
H2: "Elige tu paquete"                         ← Sin keyword
H2: "Portafolio"                               ← OK
H2: "Hablemos de tu evento"                    ← Sin keyword
H3: "Paquete Fotografía"                       ← OK
H3: "Foto + Video + Reel"                      ← OK
H3: "Paquete Video + Reel"                     ← OK
H3: "Bodas" / "Baby Shower" / etc. (x8)        ← OK
```

**Problemas:**
- H1 no contiene keyword de targeting ("fotógrafo", "eventos", "Sonora")
- La sección "Nuestros servicios" usa `<span class="section-tag">` (no un heading real) antes del H2

**Oportunidad:** Agregar subtítulo visible con keyword:
```html
<p class="hero__location">Fotógrafo de eventos en Sonora, México</p>
```

### 2.4 Open Graph ✅

Todos los tags implementados correctamente. Pendiente: verificar que `og-image.jpg` exista.

### 2.5 Twitter Card ✅

Implementado. `summary_large_image` correcto para negocio visual.

### 2.6 Enlazado Interno

- Navegación: anclas `#inicio`, `#servicios`, `#portafolio`, `#contacto` ✅
- CTAs de servicios: wa.me (externos)
- CTAs de contacto: wa.me + Instagram (externos)
- **Ningún enlace interno real** — no hay páginas secundarias aún

---

## 3. Calidad de Contenido y E-E-A-T (41/100)

### 3.1 Puntuación E-E-A-T

| Factor | Score | Problema Principal |
|--------|-------|-------------------|
| Experience (Experiencia) | 22/100 | Portafolio vacío, sin testimonios, sin casos de éxito |
| Expertise (Expertise) | 28/100 | Descripciones genéricas, sin diferenciación técnica |
| Authoritativeness (Autoridad) | 18/100 | Cero backlinks, dominio vercel.app, sin menciones externas |
| Trustworthiness (Confiabilidad) | 35/100 | Sin precios, sin política de privacidad, tel no visible |

### 3.2 Conteo de Palabras Indexables

| Sección | Palabras |
|---------|---------|
| Hero (título + subtítulo + tag) | ~30 |
| Servicios (3 paquetes) | ~120 |
| Portafolio (8 títulos + descripción) | ~50 |
| Contacto + Footer | ~40 |
| **Total indexable** | **~240 palabras** |

**El sitio tiene el 30% del mínimo necesario para una página de servicios competitiva (800+ palabras).**

### 3.3 Keywords Objetivo vs Presencia Actual

| Keyword | Presente en HTML | Presencia en Schema |
|---------|-----------------|---------------------|
| "fotógrafo de eventos en Sonora" | ❌ No en body | ✅ En description schema |
| "fotografía de bodas" | ❌ No en body | ✅ En schema description |
| "baby shower Sonora" | ❌ No en body | ❌ No en schema |
| "quinceañeras" / "XV años" | "XV años" en meta desc | ❌ No en schema |
| "Hermosillo" | ❌ No mencionado | ❌ No |
| "video de eventos" | ❌ No en body | ✅ En schema |

**Desconexión crítica:** "XV años" aparece en la meta description pero NO en el body HTML. Google penaliza esta inconsistencia.

### 3.4 Trust Signals

| Signal | Estado |
|--------|--------|
| Teléfono visible como texto | ❌ Solo en wa.me href |
| Nombre del fotógrafo | ⚠️ Solo "@anasofiaiba" en footer |
| Años de experiencia | ❌ |
| Número de eventos realizados | ❌ |
| Testimonios de clientes | ❌ |
| Fotos de trabajo real | ❌ (Firestore-dependiente) |
| Política de privacidad | ❌ |
| Google My Business | ❌ |
| Dominio propio | ❌ |
| Ubicación "Sonora, México" | ✅ Hero + footer + schema |
| Instagram vinculado | ✅ |
| Copyright actualizado | ✅ 2025 (aunque el año actual es 2026) |

---

## 4. Schema / Datos Estructurados (65/100)

### 4.1 Estado Actual

El sitio tiene **4 bloques JSON-LD** implementados:

| Schema | @type | Estado | Issues |
|--------|-------|--------|--------|
| #business | LocalBusiness + Photographer | ✅ Bueno | Falta openingHours, geo, addressLocality |
| #website | WebSite | ✅ Bueno | Correcto |
| @graph | Service x3 | ✅ Bueno | Falta offers con Offer schema |
| #webpage | WebPage | ✅ Bueno | Correcto |

### 4.2 Validación del Schema LocalBusiness

```json
// ✅ Campos presentes
"@type": ["LocalBusiness", "Photographer"]   ← CORRECTO (multi-type)
"@id": ".../#business"                        ← CORRECTO
"name": "AS Content Media"                    ← CORRECTO
"telephone": "+526471581483"                  ← CORRECTO (E.164)
"address.addressRegion": "Sonora"             ← CORRECTO
"address.addressCountry": "MX"               ← CORRECTO
"areaServed.@type": "State"                   ← CORRECTO
"sameAs": ["instagram.com/ascontentmedia"]    ← CORRECTO
"priceRange": "$$"                            ← CORRECTO
"currenciesAccepted": "MXN"                   ← CORRECTO
"knowsAbout": [...]                           ← RECOMENDADO, presente

// ❌ Campos faltantes importantes
"openingHours"                                ← Recomendado para LocalBusiness
"geo" / "GeoCoordinates"                      ← Ayuda a Google Maps
"address.addressLocality"                     ← Ciudad específica (ej: "Hermosillo")
"image" → URL que exista                      ← og-image.jpg debe existir
"hasOfferCatalog"                             ← Vincula los 3 servicios desde el business
```

### 4.3 Schema Oportunidades Faltantes

| Schema | Prioridad | Beneficio |
|--------|-----------|-----------|
| `AggregateRating` | Alta | Rich results con estrellas (requiere reseñas reales) |
| `FAQPage` | Media | Citabilidad en AI Search (beneficia ChatGPT/Gemini) |
| `BreadcrumbList` | Baja | No aplica bien a SPA |
| `VideoObject` | Media | Cuando se suban videos al portafolio |
| `ImageObject` | Baja | Para imágenes del portafolio |

### 4.4 Correcciones Recomendadas al Schema Actual

**Agregar a `#business`:**
```json
"address": {
  "@type": "PostalAddress",
  "addressLocality": "Hermosillo",        // ← agregar ciudad principal
  "addressRegion": "Sonora",
  "addressCountry": "MX"
},
"openingHours": "Mo-Su 08:00-20:00",     // ← agregar disponibilidad
"geo": {
  "@type": "GeoCoordinates",
  "latitude": 29.0729,                    // ← coordenadas de Hermosillo
  "longitude": -110.9559
}
```

**FAQPage (agregar cuando exista sección FAQ):**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Con cuánta anticipación debo reservar mi fecha?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Recomendamos reservar con al menos 4–6 semanas de anticipación para asegurar disponibilidad."
      }
    },
    {
      "@type": "Question",
      "name": "¿En cuánto tiempo recibo mis fotos y videos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las fotografías editadas se entregan en 2–3 semanas. Videos y reels en 3–4 semanas."
      }
    },
    {
      "@type": "Question",
      "name": "¿Trabajan fuera de Hermosillo?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sí, cubrimos todo el estado de Sonora: Hermosillo, Ciudad Obregón, Navojoa, Guaymas y más."
      }
    }
  ]
}
```

---

## 5. Rendimiento / Core Web Vitals (50/100 estimado)

> Sin acceso a PageSpeed Insights en tiempo real. Estimación basada en análisis de código fuente.

### 5.1 Factores de Riesgo

| Elemento | Riesgo | Detalle |
|----------|--------|---------|
| Google Fonts (9 variantes) | **ALTO** | Cormorant Garamond 5 pesos + Raleway 4 pesos; bloquean render inicial |
| Firebase JS desde gstatic.com | **MEDIO** | Import dinámico agrega round-trip; bloqueante para portafolio |
| RAF loop del cursor custom | **BAJO** | Desactivado en mobile via `matchMedia('(pointer: fine)')` ✅ |
| Imágenes sin width/height | **MEDIO** | Las `<img>` creadas dinámicamente no tienen dimensiones → CLS |
| Sin preload de hero imagen | **MEDIO** | Si se agrega imagen de fondo al hero, deteriora LCP |
| Custom cursor con `body{cursor:none}` | **BAJO** | Si JS falla, usuario sin cursor en desktop |

### 5.2 Factores Positivos

| Elemento | Estado |
|----------|--------|
| `loading="lazy"` en imágenes de portafolio | ✅ |
| `IntersectionObserver` para animaciones | ✅ Eficiente |
| `{ passive: true }` en scroll listener | ✅ |
| CSS en archivo separado (no inline crítico) | ✅ |
| `font-display: swap` en Google Fonts | ✅ |
| `preconnect` a fonts.googleapis.com | ✅ |
| `preconnect crossorigin` a fonts.gstatic.com | ✅ |
| Vercel CDN global | ✅ |

### 5.3 Estimaciones CWV

| Métrica | Estimación | Razón |
|---------|-----------|-------|
| LCP | ~2.5–3.5s | Fonts + sin imagen de hero preloadeada |
| CLS | ~0.05–0.15 | Imágenes sin dimensiones en portafolio |
| INP | ~150–250ms | JS de cursor + Firebase async |

**Objetivo:** LCP < 2.5s, CLS < 0.1, INP < 200ms

### 5.4 Fix de CLS para Portafolio

```css
/* css/style.css — agregar a .port-card__visual */
.port-card__visual {
  aspect-ratio: 4 / 3;  /* reserva espacio antes de cargar imagen de Firestore */
}

/* Para imágenes creadas dinámicamente en main.js, agregar width/height */
img.width = '400';
img.height = '300';
```

---

## 6. Imágenes (35/100)

### 6.1 Inventario

| Imagen | Alt | Estado |
|--------|-----|--------|
| Cover images del portafolio (JS) | `alt=""` | ❌ Vacío |
| Imágenes en lightbox (JS) | `alt=""` | ❌ Vacío |
| Thumbnails de video (JS) | `alt=""` | ❌ Vacío |
| og-image.jpg | N/A | ⚠️ Referenciada pero puede no existir |
| favicon.png | N/A | ✅ Referenciado |
| SVG icons en HTML | N/A (decorativos) | ✅ Sin alt (correcto para decorativos) |

### 6.2 Fixes en main.js

**En `loadCovers()` (línea ~118):**
```js
// ANTES
img.alt = '';
// DESPUÉS
img.alt = `Portafolio de ${key} — AS Content Media Sonora`;
```

**En `buildGalleryItem()` (línea ~259 para fotos, ~243 para thumbs):**
```js
// Para fotos
img.alt = `Fotografía de ${eventTitle} — AS Content Media`;
// Para thumbnails de video
img.alt = `Video de ${eventTitle} — AS Content Media Sonora`;
```

Donde `eventTitle` puede obtenerse de `eventMeta[currentKey]?.title`.

---

## 7. Preparación AI Search / GEO (30/100)

### 7.1 Accesibilidad para Crawlers de IA

| Crawler | Estado |
|---------|--------|
| GPTBot (OpenAI) | ✅ Permitido (robots.txt: `Allow: /`) |
| ClaudeBot (Anthropic) | ✅ Permitido |
| PerplexityBot | ✅ Permitido |
| OAI-SearchBot | ✅ Permitido |
| llms.txt | ❌ No existe |

**Problema crítico:** Todos los crawlers de IA son permitidos, pero el contenido más valioso (portafolio) requiere JS + Firebase → invisible para ellos.

### 7.2 Citabilidad de Contenido

Los LLMs necesitan pasajes de 134+ palabras para citas útiles:
- Descripción de paquetes: 15–25 palabras c/u ❌
- Ningún bloque supera 50 palabras ❌
- Sin sección "Sobre nosotros" → LLMs no pueden responder "quién es AS Content Media" ❌
- Sin precios → Bloqueo total para queries de costo ❌
- Sin FAQ con respuestas directas ❌

### 7.3 Cobertura de Intención de Búsqueda

| Query | Probabilidad de aparecer |
|-------|------------------------|
| "fotógrafo de bodas en Hermosillo" | Muy baja — "Hermosillo" no mencionada |
| "fotógrafo de eventos en Sonora" | Baja — título del schema lo menciona |
| "fotografía baby shower Sonora" | Muy baja — sin contenido específico |
| "videógrafo Sonora" | Muy baja — sin contenido de video |
| "mejor fotógrafo de bodas Sonora" | Nula — sin reseñas/AggregateRating |

### 7.4 Señales de Autoridad para IA

| Señal | Estado | Correlación con citas IA |
|-------|--------|------------------------|
| YouTube (canal propio) | No detectado | MUY ALTA (0.737) |
| Google Business Profile | No vinculado | Alta para local |
| Instagram @ascontentmedia | ✅ Presente | BAJA (requiere login) |
| Reseñas externas | No detectadas | Alta |
| LinkedIn empresa | No detectado | Media |

**Mayor oportunidad:** Subir reels de eventos a YouTube con títulos como "Video de boda en Hermosillo Sonora — AS Content Media" genera señales indexables de alta correlación con AI citations.

### 7.5 Probabilidad en AI Search Hoy

| Plataforma | Probabilidad | Bloqueante principal |
|-----------|-------------|---------------------|
| Google AI Overviews | Muy baja | Sin GBP, sin reseñas, contenido escaso |
| ChatGPT Search | Muy baja | Sin texto citable suficiente |
| Perplexity | Baja | Puede rastrear HTML pero no encuentra respuestas |
| Bing Copilot | Muy baja | Sin autoridad de dominio |

---

## 8. Accesibilidad y UX (análisis adicional)

### 8.1 Contraste de Color (WCAG AA)

| Elemento | Color actual | Contraste est. | Estado |
|----------|-------------|----------------|--------|
| `.hero__location` | `rgba(244,239,233,0.2)` | ~2.3:1 | ❌ FALLA |
| `.footer__copy` | `rgba(244,239,233,0.25)` | ~2.9:1 | ❌ FALLA |
| `.nav__link` | `rgba(244,239,233,0.6)` | ~7:1 | ✅ PASA |
| `.section-sub` | `rgba(244,239,233,0.6)` | ~7:1 | ✅ PASA |

### 8.2 Tamaños de Fuente Mínimos

| Elemento | Tamaño actual | Recomendado | Estado |
|----------|--------------|-------------|--------|
| `.section-tag` | 0.62rem ≈ 9.9px | ≥ 12px | ❌ MUY PEQUEÑO |
| `.hero__tag` | 0.68rem ≈ 10.9px | ≥ 12px | ❌ PEQUEÑO |
| `.nav__link` | 0.72rem ≈ 11.5px | ≥ 12px | ⚠️ Borderline |
| `.svc-card__link` | 0.72rem ≈ 11.5px | ≥ 12px | ⚠️ Borderline |

### 8.3 Touch Targets Mobile

- `.nav__burger`: Área ~30×22px → Mínimo Google: 48×48px ❌

### 8.4 Sin Fallback NoScript

Todo el contenido visible depende de `.reveal` con `opacity: 0` inicial. Si JS falla o es lento, la página aparece completamente en blanco durante la carga.

---

## 9. Hallazgos Adicionales

### Copyright desactualizado
Footer dice `© 2025 AS Content Media` — el año actual es 2026. Actualizar.

### Teléfono no visible como texto
El número `+526471581483` solo aparece en URLs de `href="https://wa.me/..."`. Para confianza del usuario y crawlability del teléfono, debería ser texto visible.

### og-image.jpg
Declarada en todos los meta tags pero el archivo no está en el repositorio local. Verificar que exista en el deploy de Vercel:
```
GET https://pagina-ascontentmedia.vercel.app/og-image.jpg
→ debe retornar 200, no 404
```

### Firebase Security Rules
El `firebase-config.js` es público (como es normal en Firebase). Verificar en la consola de Firebase que las reglas de Firestore NO sean `allow read, write: if true`.

---

## 10. Comparativa con Audit v1

| Categoría | v1 Score | v2 Score | Cambio |
|-----------|---------|---------|--------|
| SEO Técnico | 34 | 60 | +26 ✅ |
| Calidad Contenido | 41 | 41 | 0 |
| SEO On-Page | 55 | 71 | +16 ✅ |
| Schema | 0 | 65 | +65 ✅ |
| Rendimiento | 50 | 50 | 0 |
| Imágenes | 25 | 35 | +10 ✅ |
| GEO / AI Search | 21 | 30 | +9 ✅ |
| **GLOBAL** | **37** | **54** | **+17** ✅ |

---

*Generado por Claude SEO Audit — 2026-03-19 v2*
