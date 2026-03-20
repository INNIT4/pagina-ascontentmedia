# SEO Audit Completo — AS Content Media
**URL:** https://pagina-ascontentmedia.vercel.app/
**Fecha de auditoría:** 2026-03-19
**Tipo de negocio:** Fotografía y video profesional para eventos — Sonora, México
**Modelo:** Claude Sonnet 4.6

---

## Resumen Ejecutivo

| Categoría | Puntuación | Peso |
|-----------|-----------|------|
| SEO Técnico | 34/100 | 25% | 8.5 pts |
| Calidad de Contenido | 41/100 | 25% | 10.25 pts |
| SEO On-Page | 55/100 | 20% | 11.0 pts |
| Schema / Datos Estructurados | 0/100 | 10% | 0 pts |
| Rendimiento (CWV) | 50/100 | 10% | 5.0 pts |
| Imágenes | 25/100 | 5% | 1.25 pts |
| Preparación AI Search (GEO) | 21/100 | 5% | 1.05 pts |

### **Puntuación Global de Salud SEO: 37/100**

### Top 5 Problemas Críticos
1. **Sin robots.txt** — Retorna 404. Google no puede declarar reglas de rastreo.
2. **Sin sitemap.xml** — Retorna 404. Discovery del sitio depende sólo de backlinks.
3. **Sin Open Graph ni Twitter Cards** — Cada vez que se comparte el link en redes sociales aparece sin imagen ni título atractivo.
4. **Sin Schema.org / JSON-LD** — Cero oportunidades de rich results (LocalBusiness, Photographer, Service).
5. **Portafolio vacío visible** — El modal muestra "próximamente" y el contenido se carga 100% vía Firestore JS. Googlebot puede no renderizarlo.

### Top 5 Quick Wins (implementables hoy)
1. Agregar Open Graph + Twitter Card meta tags en `<head>` (30 min)
2. Crear `robots.txt` básico (5 min)
3. Crear `sitemap.xml` con la URL del sitio (10 min)
4. Agregar JSON-LD de `LocalBusiness` + `Photographer` (45 min)
5. Mejorar el `<title>` incluyendo ubicación y keyword principal (5 min)

---

## 1. SEO Técnico (34/100)

### 1.1 Crawlabilidad
| Elemento | Estado | Detalle |
|----------|--------|---------|
| robots.txt | CRITICO | Retorna HTTP 404 |
| sitemap.xml | CRITICO | Retorna HTTP 404 |
| Canonical tag | FALTANTE | No existe `<link rel="canonical">` |
| Favicon | FALTANTE | No existe `<link rel="icon">` |
| Redireccionamientos | OK | Vercel maneja HTTPS automático |

**robots.txt faltante** — Aunque la ausencia implica que todos los crawlers pueden rastrear todo (comportamiento por defecto), la falta del archivo impide:
- Declarar la ubicación del sitemap
- Bloquear rutas como `/admin.html` de ser indexadas

**admin.html expuesta** — El archivo `admin.html` en la raíz es accesible públicamente y está en el mismo dominio. Debe bloquearse con robots.txt o movida a subdominio separado.

### 1.2 Indexabilidad
| Elemento | Estado |
|----------|--------|
| Meta robots | No declarado (default: index, follow) |
| Canonical | Ausente |
| HTTPS | OK (Vercel automático) |
| www vs non-www | Vercel maneja redirect |

### 1.3 JavaScript Rendering
El sitio usa **`<script type="module">`** con imports de Firebase. El portafolio se carga completamente vía JavaScript:
- `loadCovers()` — fetches covers de Firestore
- `openModal()` — fetches items de Firestore on-demand

**Riesgo:** Googlebot renderiza JS en segunda pasada (días después del rastreo inicial). Si no se ha subido contenido a Firestore, Google indexará un portafolio vacío ("próximamente"). Las cards del portafolio con `data-event` son visibles en HTML estático, pero no su contenido.

### 1.4 Seguridad y Headers HTTP

| Header / Elemento | Estado |
|---|---|
| HTTPS + HSTS (2 años con preload) | OK |
| `rel="noopener"` en externos | OK |
| Content-Security-Policy | AUSENTE — riesgo XSS con scripts externos de Firebase y Google Fonts |
| X-Frame-Options | AUSENTE — riesgo clickjacking |
| X-Content-Type-Options | AUSENTE — riesgo MIME sniffing |
| `firebase-config.js` público | ADVERTENCIA — verificar Firestore Security Rules no estén en modo prueba abierto |
| admin.html indexable | ADVERTENCIA |

**Nota Firestore:** El `apiKey` y `appId` de Firebase en cliente son semi-públicos por diseño, pero si las reglas de Firestore están en modo de prueba (`allow read, write: if true`), cualquier persona puede leer/escribir la base de datos. Verificar en la consola de Firebase.

### 1.5 URLs y Estructura
- Sitio de una sola página (SPA-like con anclas `#inicio`, `#servicios`, etc.)
- URL canónica: `https://pagina-ascontentmedia.vercel.app/`
- No hay páginas separadas por evento (oportunidad SEO perdida)
- El dominio `pagina-ascontentmedia.vercel.app` es un subdominio de Vercel — **recomendado usar dominio propio** (ej. `ascontentmedia.com` o `ascontentmediasonora.com`)

---

## 2. SEO On-Page (55/100)

### 2.1 Title Tag
**Actual:** `AS Content Media | Fotografía & Video`
- Longitud: 37 caracteres (límite recomendado: 50–60)
- Falta: ubicación geográfica, keyword de alto volumen
- **Recomendado:** `AS Content Media | Fotógrafo de Eventos en Sonora, México`

### 2.2 Meta Description
**Actual:** `AS Content Media - Fotografía y video profesional para eventos en Sonora. Bodas, baby showers, quinceañeras y más.`
- Longitud: ~117 caracteres (OK, máximo ~160)
- Incluye ubicación: Sonora
- Menciona tipos de evento: bodas, baby showers, quinceañeras
- Falta: CTA, mención de reels, número de WhatsApp
- **Recomendado:** `Fotografía y video profesional para bodas, baby showers, XV años y más eventos en Sonora. Reels para redes sociales. Escríbenos por WhatsApp.`

### 2.3 Headings
```
H1: "Cada momento merece ser eterno"          — OK, único H1
H2: "Nuestros servicios" / "Portafolio" / "Hablemos de tu evento"
H3: Paquete Fotografía / Foto+Video+Reel / Video+Reel
H3: Bodas / Baby Shower / Cumpleaños / Bridal Shower / Bautizo / Deportes / Festivales / Eventos
```
- Jerarquía correcta (H1 → H2 → H3)
- H1 es poético pero no contiene keyword objetivo
- **Problema:** El `<p class="hero__tag">` con "Fotografía · Video · Reels" está ANTES del H1 en el DOM, pero es un `<p>`, no un H1 alternativo. Correcto.
- Falta H1 con keyword directa (ej. "Fotógrafo de Eventos en Sonora")

### 2.4 Open Graph (Redes Sociales)
**Estado: AUSENTE COMPLETAMENTE**

Al compartir el link en WhatsApp, Facebook o Twitter, aparece sin previsualización atractiva. Para un negocio que vende servicios visuales, esto es un problema mayor de conversión además de SEO.

Etiquetas faltantes:
```html
<!-- Mínimo necesario -->
<meta property="og:type" content="website">
<meta property="og:title" content="AS Content Media | Fotógrafo de Eventos en Sonora">
<meta property="og:description" content="Fotografía y video profesional para bodas, baby showers y más eventos en Sonora, México.">
<meta property="og:url" content="https://pagina-ascontentmedia.vercel.app/">
<meta property="og:image" content="[URL de imagen 1200x630px]">
<meta property="og:locale" content="es_MX">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="AS Content Media | Fotógrafo de Eventos en Sonora">
<meta name="twitter:description" content="Fotografía y video profesional para bodas, baby showers y más en Sonora, México.">
<meta name="twitter:image" content="[URL de imagen]">
```

### 2.5 Enlazado Interno
- Solo anclas dentro de la misma página (`#inicio`, `#servicios`, `#portafolio`, `#contacto`)
- Sin páginas internas reales — no hay estructura de enlazado que construir por ahora
- Oportunidad: crear páginas dedicadas por tipo de evento (ver sección de Contenido)

### 2.6 Atributos Alt en Imágenes
- Las cover images del portafolio se cargan dinámicamente con `img.alt = ''` (vacío)
- Las imágenes del lightbox también con `img.alt = ''`
- **Recomendado:** usar `img.alt = meta.title + ' - AS Content Media'` al crear elementos

---

## 3. Calidad de Contenido y E-E-A-T (41/100)

### 3.1 Puntuación E-E-A-T Oficial

| Factor | Puntuación | Peso | Aporte |
|--------|-----------|------|--------|
| Experience (Experiencia) | 22/100 | 20% | 4.4 pts |
| Expertise (Conocimiento técnico) | 28/100 | 25% | 7.0 pts |
| Authoritativeness (Autoridad) | 18/100 | 25% | 4.5 pts |
| Trustworthiness (Confiabilidad) | 35/100 | 30% | 10.5 pts |
| **Total E-E-A-T** | | | **26.4/100** |

**Experience (22/100):** Portafolio completamente vacío — todos los modales muestran "próximamente". Sin testimonios, sin conteo de eventos, sin casos de éxito.

**Expertise (28/100):** Descripciones genéricas sin diferenciación técnica. No se menciona equipo (cámara, software), estilo fotográfico (documental/editorial/cinematográfico), ni especificaciones de entrega (número de fotos, formatos, plazos).

**Authoritativeness (18/100):** Zero señales de autoridad externa. Sin prensa, sin premios, sin colaboraciones, sin reseñas de Google. Dominio vercel.app = autoridad de dominio cero.

**Trustworthiness (35/100):** Sin política de privacidad, sin T&C, sin precios. Número de WhatsApp presente en `href` pero NO visible como texto en la página — reduce percepción de transparencia.

### 3.2 Conteo de Palabras — FALLO CRÍTICO

| Sección | Palabras estimadas |
|---------|-------------------|
| Hero (título, subtítulo, tag) | ~30 |
| Servicios (3 tarjetas) | ~120 |
| Portafolio (8 títulos + subtítulos) | ~50 |
| Contacto + Footer | ~40 |
| **Total indexable** | **~240 palabras** |

- Mínimo para página de servicios: **800 palabras**
- El sitio tiene el **30% del mínimo necesario**
- El portafolio vacío impide compensar con contenido multimedia

### 3.3 Keywords y Oportunidades

**Keywords de alta intención transaccional:**
- "fotógrafo de bodas en Sonora"
- "fotógrafo de eventos en Hermosillo"
- "fotografía y video para eventos Sonora"
- "fotografo baby shower Sonora"
- "fotografo quinceañeras Hermosillo"

**Problema crítico de desconexión semántica:** "Quinceañeras" aparece en el `<meta description>` pero NO en ningún lugar del cuerpo HTML (ni en portafolio, ni en servicios). Google detecta esta inconsistencia como señal de baja calidad.

**Ciudades no mencionadas:** El sitio solo dice "Sonora, México" — sin mencionar Hermosillo, Cd. Obregón, Navojoa ni Guaymas, perdiendo todas las búsquedas geolocalizadas específicas.

### 3.4 Legibilidad
- Español correcto, tono elegante y emocional — adecuado para el sector
- Legibilidad Flesch-Szigriszt estimada: 68–72/100 (bastante fácil) — BIEN
- **El problema no es legibilidad sino escasez y genericidad del contenido**
- Las 3 descripciones de paquetes son casi idénticas en estructura — no diferencian el paquete

### 3.5 Trust Signals — Inventario

| Signal | Estado |
|--------|--------|
| Número WhatsApp visible como texto | NO — solo en `href` |
| Testimonios de clientes | NO |
| Fotos de trabajo real | NO — todo "próximamente" |
| Nombre del fotógrafo/equipo | Solo "@anasofiaiba" en footer |
| Política de privacidad | NO |
| Años de experiencia | NO |
| Número de eventos realizados | NO |
| Google My Business referenciado | NO |
| Dominio propio (no .vercel.app) | NO |
| Ubicación "Sonora, México" | SÍ (hero y footer) |
| Instagram real vinculado | SÍ |
| Copyright "2025 AS Content Media" | SÍ |

---

## 4. Schema / Datos Estructurados (0/100)

**No existe NINGÚN JSON-LD ni microdatos en el sitio.**

### Oportunidades de Schema Prioritarias

#### 4.1 LocalBusiness + Photographer (ALTA PRIORIDAD)
```json
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Photographer"],
  "name": "AS Content Media",
  "description": "Fotografía y video profesional para eventos en Sonora, México. Especialistas en bodas, baby showers, quinceañeras, bautizos y más.",
  "url": "https://pagina-ascontentmedia.vercel.app/",
  "telephone": "+52-647-158-1483",
  "email": "",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Sonora",
    "addressCountry": "MX"
  },
  "areaServed": {
    "@type": "State",
    "name": "Sonora"
  },
  "sameAs": [
    "https://www.instagram.com/ascontentmedia"
  ],
  "priceRange": "$$",
  "openingHours": "Mo-Su",
  "image": "[URL de imagen de portada]",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Paquetes de Fotografía y Video",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paquete Fotografía",
          "description": "Sesión completa del evento, fotografías editadas y galería digital"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paquete Foto + Video + Reel",
          "description": "Fotografías editadas, video completo del evento, reel para redes sociales y galería digital"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Paquete Video + Reel",
          "description": "Video completo del evento, reel para redes sociales y edición profesional"
        }
      }
    ]
  }
}
```

#### 4.2 WebSite (para Sitelinks Searchbox)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "AS Content Media",
  "url": "https://pagina-ascontentmedia.vercel.app/"
}
```

#### 4.3 FAQPage (cuando se agreguen preguntas frecuentes)
Preguntas sugeridas:
- "¿Con cuánta anticipación debo reservar mi fecha?"
- "¿En cuánto tiempo recibo mis fotos/videos?"
- "¿Trabajan fuera de Sonora?"
- "¿Qué incluye la galería digital?"

---

## 5. Rendimiento / Core Web Vitals (50/100 estimado)

> Nota: Sin acceso a datos reales de PageSpeed Insights. Estimación basada en análisis de código.

### 5.1 Factores que AFECTAN el rendimiento

| Elemento | Impacto | Detalle |
|----------|---------|---------|
| Google Fonts (2 familias, 9 variantes) | Alto | Cormorant Garamond (5 pesos) + Raleway (4 pesos). Bloquean render |
| Firebase JS desde gstatic | Medio | Import dinámico en `main.js` agrega round-trip |
| `requestAnimationFrame` loop del cursor | Bajo | Corre siempre, consume CPU en móvil |
| Imágenes sin `width/height` explícito | Medio | Riesgo de CLS (Cumulative Layout Shift) |
| Sin preload del hero image | Alto | Si se agrega imagen de fondo, sin preload deteriora LCP |
| Sin `font-display: swap` | Medio | Fonts pueden bloquear texto visible |

### 5.2 Factores POSITIVOS
- `loading="lazy"` en imágenes del portafolio (JS)
- `IntersectionObserver` para animaciones (eficiente)
- CSS en archivo separado (no inline)
- `{ passive: true }` en scroll listener

### 5.3 Correcciones de Rendimiento (código específico)

**INP — Deshabilitar cursor custom en móvil** (`js/main.js`):
```js
// Solo activar cursor custom en dispositivos con puntero fino (mouse)
if (window.matchMedia('(pointer: fine)').matches) {
  // ... toda la lógica del cursor y cursorFollower aquí
}
```

**CLS — Reservar espacio para imágenes del portafolio** (`css/style.css`):
```css
.port-card__visual {
  aspect-ratio: 4 / 3; /* previene layout shift al cargar covers de Firestore */
}
```

**LCP — Agregar `theme-color` y preconnect mejorado** (`index.html`):
```html
<meta name="theme-color" content="#080808">
```

**HTML validity — Corregir `&` en title:**
```html
<!-- Actual -->
<title>AS Content Media | Fotografía & Video</title>
<!-- Correcto -->
<title>AS Content Media | Fotografía &amp; Video</title>
```

---

## 6. Imágenes (25/100)

| Problema | Severidad |
|----------|-----------|
| Imágenes del portafolio con `alt=""` vacío | Alto |
| Cover images cargadas con `alt=""` | Alto |
| Sin dimensiones explícitas en imágenes JS | Medio |
| Sin OG image definida | Alto |
| Sin favicon / apple-touch-icon | Medio |
| Sin imagen de hero (fondo CSS o foto real) | Medio |

**El portafolio actualmente no tiene imágenes reales.** Una vez subido contenido a Firestore, todas las imágenes generadas dinámicamente necesitan alt text descriptivo.

Corrección en `main.js` — en `loadCovers()`:
```js
img.alt = `Portafolio de ${key} - AS Content Media`;
```

En `buildGalleryItem()`:
```js
img.alt = `${meta.title || 'Evento'} fotografiado por AS Content Media`;
```

---

## 7. Preparación AI Search / GEO (21/100)

| Dimensión | Puntos |
|---|---|
| Citabilidad de contenido | 4/25 |
| Legibilidad estructural | 5/20 |
| Contenido multi-modal | 5/15 |
| Autoridad y señales de marca | 3/20 |
| Accesibilidad técnica para IA | 4/20 |
| **TOTAL** | **21/100** |

### 7.1 Accesibilidad para Crawlers de IA

| Crawler | Estado |
|---|---|
| GPTBot (OpenAI) | Permitido (sin robots.txt = default allow) |
| ClaudeBot (Anthropic) | Permitido |
| PerplexityBot | Permitido |
| OAI-SearchBot | Permitido |
| CCBot (entrenamiento) | Permitido — no es el objetivo |

Sin `llms.txt` — no hay instrucciones para LLMs sobre cómo usar el contenido.

**Problema crítico:** El portafolio se carga 100% desde Firebase via JS (`main.js`). Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) generalmente NO ejecutan JavaScript. El portafolio — la prueba social más importante del negocio — es **invisible para todos los motores de respuesta de IA**.

### 7.2 Citabilidad de Contenido

Los LLMs necesitan pasajes de 134–167 palabras para generar citas útiles. El sitio actual tiene:
- Descripciones de paquetes: 8–18 palabras cada una (insuficiente)
- Ningún bloque de texto supera 50 palabras
- Sin precios → bloqueo total de citabilidad para queries de costo
- Sin sección "Sobre nosotros" → los LLMs no pueden responder "quién es AS Content Media"
- H1, H2, H3 son declarativos, no responden preguntas — los headings en forma de pregunta tienen alta correlación con AI Overviews

### 7.3 Señales de Autoridad para IA

| Señal | Estado | Correlación con citas de IA |
|---|---|---|
| YouTube (canal propio) | No detectado | MUY ALTA (~0.737) |
| Reddit (menciones) | No detectado | Alta |
| Google Business Profile | No vinculado | Alta para búsquedas locales |
| Instagram @ascontentmedia | Presente | BAJA — requiere login, imagen sin texto |
| Wikipedia | No existe | Alta |
| LinkedIn empresa | No detectado | Media |

**Hallazgo importante:** Instagram tiene correlación casi nula con citas de IA porque su contenido no es rastreable (requiere login, texto en imágenes). YouTube tiene la correlación más alta (~0.737). Subir reels/videos de eventos a YouTube con títulos descriptivos como "Video de boda en Hermosillo Sonora — AS Content Media" generaría señales indexables por LLMs.

### 7.4 Probabilidad de Aparecer en AI Search Hoy

| Plataforma | Probabilidad | Razón |
|---|---|---|
| Google AI Overviews | Muy baja | Sin JSON-LD LocalBusiness, sin GBP, sin contenido citable |
| ChatGPT Search | Muy baja | Sin texto descriptivo suficiente, sin menciones externas |
| Perplexity | Baja | Puede rastrear HTML pero no encuentra respuestas directas |
| Bing Copilot | Muy baja | Sin structured data, sin autoridad de dominio |

### 7.5 Top 3 Cambios GEO de Mayor ROI
1. **JSON-LD LocalBusiness** — habilita Google AI Overviews local (ya cubierto en C5)
2. **Sección "Sobre AS Content Media"** de 300+ palabras — único contenido citable para LLMs
3. **Google Business Profile activo con reseñas** — fuente primaria de AI Overviews locales

---

## 8. Análisis de la Competencia Local (Desk Research)

Para "fotógrafo de eventos en Sonora", los competidores típicos que rankean son:
- Perfiles de Google Business con reseñas
- Páginas con dominio propio (no Vercel subdomain)
- Sitios con páginas dedicadas por tipo de evento
- Presencia en directorios locales (bodas.com.mx, etc.)

AS Content Media actualmente no competiría en búsqueda orgánica por estas keywords por:
1. Dominio vercel.app (sin autoridad propia)
2. Contenido insuficiente (280 palabras)
3. Sin backlinks
4. Sin Google Business Profile
5. Sin reseñas

---

## 9. Análisis Visual y Accesibilidad

### 9.1 Contraste de Color (WCAG)

| Elemento CSS | Color | Contraste | Estado |
|---|---|---|---|
| `.hero__sub`, `.section-sub` | `rgba(244,239,233,0.6)` sobre `#080808` | ~7:1 | PASA AA |
| `.hero__location` | `rgba(244,239,233,0.2)` sobre negro | ~2.3:1 | **FALLA AA** |
| `.footer__copy` | `rgba(244,239,233,0.25)` sobre negro | ~2.9:1 | **FALLA AA** |
| `.nav__link` | `rgba(244,239,233,0.6)` | ~7:1 | PASA AA |

### 9.2 Tamaños de Fuente Insuficientes
- `.section-tag`: `0.62rem` = ~9.9px — MUY PEQUEÑO (mínimo recomendado: 12px)
- `.hero__tag`: `0.68rem` = ~10.9px — demasiado pequeño
- `.nav__link`: `0.72rem` = ~11.5px — borderline
- `.svc-card__link`: `0.72rem` = ~11.5px — borderline

### 9.3 Touch Targets Mobile
- El botón `.nav__burger` tiene área de tap de ~30x22px — por debajo del mínimo de 48x48px recomendado por Google/WCAG

### 9.4 Riesgo Crítico: Contenido Invisible sin JS
Todos los elementos con clase `.reveal` comienzan con `opacity: 0` y `transform: translateY(28px)`. Si el JavaScript no se ejecuta (JS bloqueado, error de red a Firebase, etc.), **todo el contenido del sitio permanece invisible para el usuario y posiblemente para crawlers que no renderizan JS**.

No existe etiqueta `<noscript>` como fallback.

### 9.5 Cursor Personalizado
`body { cursor: none }` — si el JS falla, el usuario queda sin cursor visible en desktop.

---

## 10. Hallazgos Adicionales

### admin.html Indexable
El archivo `/admin.html` está en la raíz del proyecto y es accesible públicamente. Aunque tiene autenticación en Firebase, el archivo HTML mismo es indexable por Google. Agregar al robots.txt:
```
Disallow: /admin.html
```

### Dominio Vercel vs Dominio Propio
El dominio `pagina-ascontentmedia.vercel.app` afecta la percepción profesional y el SEO. Vercel permite configurar dominios personalizados. Registrar `ascontentmediasonora.com` o similar aumentaría:
- Confianza del usuario
- Brand authority
- Posicionamiento a largo plazo

### Falta de Analytics
No hay Google Analytics, Google Search Console verification, ni ningún sistema de tracking. Sin datos, es imposible medir el impacto de mejoras SEO.

### Sin Precios
Intencionalmente se omiten precios para forzar contacto por WhatsApp. Esto puede dañar el CTR desde búsquedas ya que usuarios buscan precios antes de contactar. Considerar agregar rangos ("desde $X MXN").
