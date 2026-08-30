# SEO — Kuentra

## 1. Objetivo

Mejorar la visibilidad orgánica de Kuentra en búsquedas relevantes de Argentina, con páginas útiles, claras y técnicamente indexables. El objetivo no es sumar texto o etiquetas sin propósito: cada mejora debe facilitar que usuarios y buscadores comprendan qué ofrece Kuentra, para quién y en qué URL canónica.

## 2. Estado actual

Auditoría inicial realizada el 2026-08-30, sin modificar código funcional, metadata, sitemap, robots, diseño ni configuración de infraestructura.

El frontend es una aplicación Next.js 16 con App Router. La home (`/`) se entrega prerenderizada/SSR con el contenido principal y sus metadatos ya presentes en el HTML inicial. La metadata se centraliza en `frontend/web/app/layout.tsx`; `sitemap.xml` y `robots.txt` se generan mediante las rutas nativas `app/sitemap.ts` y `app/robots.ts`.

La única página pública indexable actual es la home. El catálogo de seis servicios vive como secciones dentro de esa URL; no hay fichas públicas individuales. La ruta administrativa `/admin/opiniones` declara `noindex, nofollow` y no está en el sitemap.

## 3. Infraestructura e indexación

| Elemento | Estado actual | Evidencia / observación |
| --- | --- | --- |
| Dominio | `https://kuentra.com.ar` | Es el dominio declarado como base de metadata y canonical. `www.kuentra.com.ar` no resolvía DNS durante esta auditoría; no genera duplicado, pero tampoco redirige. |
| HTTPS | OK | `http://kuentra.com.ar/` termina en `https://kuentra.com.ar/` con respuesta 200. |
| Sitemap | OK, mejorable | `https://kuentra.com.ar/sitemap.xml` responde XML válido y contiene una sola URL: `https://kuentra.com.ar`. Es generado por `frontend/web/app/sitemap.ts`. |
| Robots | OK, revisar cambios externos | `https://kuentra.com.ar/robots.txt` permite `User-agent: *` y referencia el sitemap. Además contiene un bloque administrado por Cloudflare que restringe algunos crawlers de IA; Googlebot no queda bloqueado. Ese bloque no está en el repositorio. |
| Google Search Console | Configurado (según contexto) | Propiedad verificada, sitemap enviado y correcto. No se auditó cobertura, rendimiento ni consultas porque no se recibió acceso a esos reportes. |
| Indexación actual | Home indexada (según contexto) | Search Console reporta una URL descubierta desde sitemap. La home es indexable; `/admin/opiniones` incluye `noindex, nofollow`. |

## 4. Auditoría técnica

### Metadata

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Mejorable | `frontend/web/app/layout.tsx` | La home publica título por defecto `Kuentra \| Servicios digitales más simples` y una meta description específica y natural. `metadataBase` está configurado. La ruta admin hereda la description y metadatos sociales de la home aunque noindex. | Conservar la metadata actual de la home. Al crear rutas públicas, definir título y description propios. En una etapa futura, neutralizar o especificar la metadata heredada del área admin para evitar señales confusas, sin quitar su `noindex`. |
| Mejorable | `frontend/web/components/page-title-switcher.tsx` | Un componente cliente reemplaza `document.title` al ocultarse la pestaña. El HTML inicial conserva el título correcto, pero el título visible deja de coincidir con la metadata declarada. | Evaluar eliminar este cambio de título o limitarlo fuera de la metadata SEO. No implementar en esta etapa. |

### Canonical

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Mejorable | `frontend/web/app/layout.tsx` | La home emite una única canonical absoluta: `https://kuentra.com.ar`. | Mantenerla para `/`. Cuando haya páginas públicas nuevas, definir su canonical propia. |
| Mejorable | `frontend/web/app/admin/opiniones/page.tsx`, `frontend/web/app/layout.tsx` | `/admin/opiniones` es `noindex, nofollow`, pero hereda la canonical de la home. No produce contenido duplicado indexable por el noindex, aunque la señal es inconsistente. | Ajustar la metadata administrativa en una etapa separada; conservar el bloqueo de indexación. |

### Robots e indexación

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `frontend/web/app/robots.ts`, `frontend/web/app/admin/opiniones/page.tsx` | La regla local permite el rastreo del sitio y el admin declara `noindex, nofollow`. No se detectó `X-Robots-Tag` contradictorio en la home. | No modificar sin una necesidad concreta. Validar en Search Console tras publicar rutas nuevas. |
| Revisar | Cloudflare (externo al repositorio) | Cloudflare agrega un bloque de “content signals” al `robots.txt`, incluyendo restricciones para `Google-Extended` y otros bots de IA. No bloquea Googlebot para resultados de búsqueda. | Registrar cualquier cambio hecho en Cloudflare y verificar siempre que `User-agent: Googlebot` siga permitido. |

### Sitemap

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Mejorable | `frontend/web/app/sitemap.ts` | Incluye correctamente la URL canónica de la home, con frecuencia semanal y prioridad 1. Solo hay una URL pública indexable. `lastModified: new Date()` publica una fecha nueva al regenerarse el sitemap, aunque el contenido no haya cambiado. | Al realizar el siguiente cambio de sitemap, usar una fecha de modificación real o omitir `lastModified` hasta disponer de una fuente confiable. Añadir rutas públicas solo cuando estén listas para indexar. |

### Open Graph y Twitter/X

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `frontend/web/app/layout.tsx`, `frontend/web/public/kuentra-social.jpg` | La home declara una imagen social JPEG propia de 1200×630: `og:image`, `og:image:alt`, `og:image:width`, `og:image:height`, `twitter:image` y `twitter:image:alt`. El asset conserva su diseño visual y redujo su peso de 954 KB a 77 KB. Con `metadataBase`, Next.js resuelve la URL absoluta `https://kuentra.com.ar/kuentra-social.jpg`. La tarjeta conserva `summary_large_image`. | Mantener este único asset para la home y validar su vista previa luego de cada cambio visual relevante. |

### Schema.org / datos estructurados

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `frontend/web/app/page.tsx` | La home publica JSON-LD en el HTML inicial con `Organization` y `WebSite`, relacionados mediante `@id`. | Mantener el marcado limitado a datos verificados y revisarlo ante cualquier cambio institucional o de dominio. |

Propiedades implementadas:

- `Organization`: `@id`, `name`, `url` y `logo` (`https://kuentra.com.ar/kuentra-mark.png`).
- `WebSite`: `@id`, `name`, `url`, `inLanguage` (`es`) y `publisher` que referencia a la organización mediante `@id`.

Propiedades omitidas por no estar confirmadas: razón social, CUIT, dirección, teléfono, email, founder, fecha de fundación, empleados, redes sociales / `sameAs`, `contactPoint`, reviews, `aggregateRating`, `Product`, `Offer` y precios.

### Headings y jerarquía de contenido

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `frontend/web/components/hero.tsx`, `sections.tsx`, `product-card.tsx` | La home tiene un único H1 (“Tus servicios digitales. Más simples. Más accesibles.”). Las secciones principales usan H2 y las tarjetas/proceso usan H3. La jerarquía no salta niveles. | Mantener un solo H1 por página pública y títulos H2/H3 que describan el contenido, no únicamente el estilo visual. |

### Semántica HTML

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `app/page.tsx`, `components/site-header.tsx`, `sections.tsx`, `product-card.tsx`, `footer.tsx` | Se usan `header`, `nav`, `main`, `section`, `article`, listas ordenadas para el proceso, `figure`/`figcaption` para opiniones, `details`/`summary` para FAQ y `footer`. La navegación de escritorio tiene nombre accesible. | Preservar estos landmarks al modificar la UI. Añadir nombre accesible a todo `nav` nuevo, incluido el móvil. |

### Imágenes e iconos

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Mejorable | `frontend/web/components/brand.tsx`, `sections.tsx`, `frontend/web/public/*` | El logo decorativo usa `alt=""` de forma correcta; la mascota usa `alt="Mascota de Kuentra"`. `next/image` se usa para ambas. | Mantener alt vacío solo en imágenes decorativas y alt descriptivo en imágenes informativas. |
| Resuelto | `frontend/web/components/brand.tsx`, `hero.tsx`, `footer.tsx` | Seobility reportó tres imágenes sin alt. Se verificó la home publicada: ninguna etiqueta `<img>` carece de atributo `alt`. Las tres instancias de `kuentra-mark.svg` usan `alt=""` intencionalmente porque son decorativas y acompañan texto o etiquetas accesibles. | No agregar texto alternativo: sería redundante y empeoraría la experiencia con lectores de pantalla. |
| Mejorable | `frontend/web/app/layout.tsx`, `frontend/web/public/kuentra-mark.png`, `frontend/web/public/kuentra-mark.svg` | Se declara un PNG como favicon y apple-touch-icon. No existe `/favicon.ico` (respuesta 404). El PNG mide 1254×1254 y pesa ~250 KB, mientras que ya existe un SVG de marca. | En una etapa posterior generar iconos adecuados por tamaño/formato y un `favicon.ico` o la convención nativa de Next; no reemplazar activos sin validar el resultado visual. |
| Revisar | `frontend/web/public/mascota.png`, `components/sections.tsx` | La fuente de la mascota pesa ~832 KB (1974×797), aunque se muestra mucho más pequeña. `next/image` puede optimizar su entrega; no se realizó una medición de bytes transferidos en navegador. | Auditar el recurso final servido y optimizar dimensiones/formato si aparece como oportunidad en Lighthouse/PageSpeed. |

### URLs, rutas públicas y contenido duplicado

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK | `frontend/web/app/page.tsx`, `frontend/web/app/sitemap.ts` | La única URL pública indexable intencional es `/`. Las secciones usan anclas (`#productos`, `#como-funciona`, `#opiniones`, `#preguntas`, `#contacto`) y no generan documentos duplicados. | Mantener las anclas como navegación interna; no incluirlas en sitemap ni canonical independientes. |
| Mejorable | `frontend/web/data/products.ts`, `components/product-card.tsx` | Hay seis productos ricos en términos de búsqueda, pero solo aparecen dentro de la home y sus CTAs apuntan a `#contacto`. No hay URLs individuales que puedan competir por intención específica. | Antes de crear rutas, definir arquitectura, contenido original, canonical, sitemap y aprobación comercial/legal de cada producto. Es una mejora de alto potencial pero no se implementará automáticamente. |
| Mejorable | `frontend/web/components/footer.tsx` | El enlace de Instagram usa `href="#"`; no aporta una URL de destino útil. | Reemplazarlo por una URL real y segura cuando esté disponible, o quitarlo hasta entonces. |
| Revisar | DNS / Cloudflare | El subdominio `www` no resolvía durante la auditoría. | Decidir si se habilita `www` para redirigir 301 al dominio canónico o si se documenta como variante no soportada. Evitar que, si se habilita, sirva contenido en paralelo. |

### Rendimiento y Core Web Vitals

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Revisar | `frontend/web/app/page.tsx`, `layout.tsx` | La home responde prerenderizada (`x-nextjs-prerender: 1`) y usa fuentes de `next/font` con `display: swap`; ambas decisiones favorecen el render inicial. | Conservar SSR/ISR y volver a medir cada etapa. |
| Revisar | `components/page-title-switcher.tsx`, `orbit-cursor-trail.tsx`, `reviews-experience.tsx`, `globals.css` | Hay JavaScript cliente para cambio de título, cursor animado, reseñas y formulario, además de animaciones CSS. Se respeta `prefers-reduced-motion` y se desactiva el cursor en punteros táctiles. El cursor usa `requestAnimationFrame` continuo en escritorio. | Medir con Lighthouse/PageSpeed antes de optimizar. Si TBT/INP o CPU móvil resultan afectados, priorizar diferir o simplificar efectos no esenciales. |
| Revisar | `frontend/web/public/mascota.png`, `kuentra-mark.png` | Hay activos PNG grandes; no se confirmó su peso de transferencia ni métricas LCP/INP/CLS reales. La consulta a la API pública de PageSpeed del 2026-08-30 respondió HTTP 429. | Registrar una línea base de PageSpeed Insights (móvil y escritorio) y CrUX/Search Console cuando la cuota esté disponible. No declarar valores de Core Web Vitals sin esos datos. |

### SEO móvil

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Revisar | `frontend/web/app/layout.tsx`, `globals.css`, `site-header.tsx` | Existe viewport `width=device-width, initialScale=1`; la grilla y tipografías tienen breakpoints; el menú móvil usa `details`; los objetivos `.button` tienen mínimo 48 px. | Validar visualmente con Lighthouse/Chrome en tamaños móviles reales antes de cambios que alteren contenido o navegación. |

### Accesibilidad que puede afectar SEO

| Estado | Archivos implicados | Hallazgo | Recomendación |
| --- | --- | --- | --- |
| OK / Mejorable | `frontend/web/app/layout.tsx`, `components/*` | `html` declara `lang="es"`; hay etiquetas y roles accesibles en logo, CTAs, diálogo, botones de calificación y control de navegación. Las imágenes analizadas tienen alt adecuado. | Mantener estos atributos en todo cambio. |
| Mejorable | `frontend/web/components/site-header.tsx` | El `nav` móvil no tiene `aria-label`, a diferencia del menú de escritorio. | Añadir una etiqueta de navegación accesible cuando se trabaje accesibilidad. |
| Mejorable | `frontend/web/components/review-form.tsx` | El diálogo tiene roles y etiqueta, pero no se observa manejo de foco al abrir/cerrar ni una trampa de foco. | Corregirlo en una etapa de accesibilidad; mejora la experiencia sin impacto negativo de SEO. |
| Revisar | `frontend/web/app/globals.css` | No se hizo una medición automática de contraste ni auditoría de teclado completa. | Ejecutar Lighthouse Accessibility y pruebas manuales de teclado antes de considerar este punto cerrado. |

## 5. Reglas permanentes para futuros cambios SEO

- Todo cambio SEO debe documentarse en este archivo.
- No modificar diseño, comportamiento o lógica funcional sin necesidad.
- No agregar dependencias SEO innecesarias.
- Priorizar APIs nativas del framework antes que librerías externas.
- No generar metadata duplicada.
- Mantener una única URL canonical por página.
- No bloquear Googlebot accidentalmente.
- No modificar robots.txt o sitemap sin justificarlo.
- No usar keyword stuffing.
- No crear texto artificial únicamente para posicionar.
- Mantener títulos y descripciones naturales y orientados al usuario.
- Toda nueva página pública debe evaluarse para sitemap, metadata y canonical.
- Toda imagen relevante debe tener alt descriptivo.
- Mantener compatibilidad con SSR/SSG si el proyecto la utiliza.
- Antes de cambiar URLs públicas, evaluar impacto SEO.
- No eliminar metadata existente sin revisar por qué fue creada.
- Evitar cambios grandes de SEO en una sola implementación.
- Trabajar por etapas pequeñas y verificables.
- Después de cada etapa, actualizar este documento.

## 6. Historial de cambios SEO

| Fecha | Cambio | Archivos | Motivo | Estado |
| --- | --- | --- | --- | --- |
| 2026-08-30 | Auditoría técnica inicial y creación de este contexto SEO. No se cambiaron metadatos, código funcional, sitemap, robots ni diseño. | `docs/SEO.md` | Establecer una línea base y un proceso de trabajo SEO ordenado. | Completado |
| 2026-08-30 | Creación y configuración de una imagen social para Open Graph y Twitter/X. | `frontend/web/public/kuentra-social.png`, `frontend/web/app/layout.tsx`, `docs/SEO.md` | Completar las etiquetas de imagen de la home sin modificar URLs, sitemap, robots, Schema ni contenido visible. | Completado |
| 2026-08-30 | Reemplazo del contenido de la imagen social por el asset visual aprobado de Restate, sin cambiar su URL pública. | `docs/design-reference/restate/Imagensocial.png`, `frontend/web/public/kuentra-social.png`, `frontend/web/app/layout.tsx`, `docs/SEO.md` | Usar la variante visual seleccionada para las vistas previas sociales. | Completado |
| 2026-08-30 | Optimización del PNG social existente a 1200×630, conservando contenido y proporción visual. | `frontend/web/public/kuentra-social.png`, `frontend/web/app/layout.tsx`, `docs/SEO.md` | Reducir el peso de la imagen para social sharing sin cambiar su URL ni su contenido visual. | Completado |
| 2026-08-30 | Verificación de locale de Open Graph. La configuración ya era `es_AR`; no requirió cambio de metadata. | `frontend/web/app/layout.tsx`, `docs/SEO.md` | Confirmar español de Argentina en la metadata social sin introducir una modificación redundante. | Completado |
| 2026-08-30 | Conversión de la imagen social de PNG a JPEG de alta calidad (92), conservando diseño y dimensiones 1200×630. | `frontend/web/public/kuentra-social.jpg`, `frontend/web/public/kuentra-social.png` (eliminado), `frontend/web/app/layout.tsx`, `docs/SEO.md` | Reducir el peso para social sharing de 954 KB a 77 KB (−91,9 %) sin alterar el diseño visual. | Completado |
| 2026-08-30 | Revisión de las tres advertencias de Image SEO de Seobility. | `docs/SEO.md` | Confirmar que las tres marcas decorativas tienen `alt=""` intencional y que no hay etiquetas `<img>` sin atributo alt en la home publicada. | Resuelto, sin cambios de código |
| 2026-08-30 | Implementación de JSON-LD para `Organization` y `WebSite` en la home. | `frontend/web/app/page.tsx`, `docs/SEO.md` | Aportar datos estructurados verificables sin añadir información comercial, de contacto o reputación no confirmada. | Completado |

## 7. Backlog SEO

### P0 — crítico

- Sin acciones P0 detectadas en esta auditoría. La home es indexable, tiene canonical, no bloquea Googlebot, responde por HTTPS y figura en el sitemap.

### P1 — importante

- Definir la estrategia de `www.kuentra.com.ar`: redirección 301 al dominio canónico si se habilita, o confirmación documentada de que no se usará.
- Definir arquitectura y contenido aprobados para páginas públicas de productos; cada una debe nacer con metadata, canonical, sitemap y contenido propio. No crear páginas automáticamente solo a partir de la ficha actual.
- Registrar una línea base de rendimiento móvil/escritorio en PageSpeed Insights y datos de campo en Search Console/CrUX cuando estén disponibles.

### P2 — mejora

- Sustituir el `lastModified` generado con la hora actual por una fecha real de cambio o eliminarlo temporalmente del sitemap.
- Revisar el cambio de título al perder foco para que el título de pestaña no diverja de la metadata SEO.
- Crear iconos web adecuados, incluido `favicon.ico`, y comprobar sus variantes de dispositivo.
- Validar peso y formato efectivamente transferidos de `mascota.png`; optimizar solo si la medición lo justifica.
- Completar accesibilidad: etiqueta del nav móvil, foco del diálogo, contraste y recorrido completo de teclado.
- Reemplazar el enlace placeholder de Instagram por un destino real o retirarlo.

## 8. Próximo paso recomendado

La etapa de imagen social se completó el 2026-08-30. Antes de iniciar otro cambio técnico, el próximo paso recomendado es decidir y documentar la estrategia para `www.kuentra.com.ar`: habilitarlo exclusivamente si redirige de forma permanente al dominio canónico o confirmar que seguirá sin usarse.

No se debe modificar DNS, Cloudflare ni redirecciones hasta abrir una etapa específica para ese objetivo. Cuando se realice, deberá verificarse que toda variante de `www` responda con una única redirección permanente hacia `https://kuentra.com.ar/`, sin servir contenido duplicado.

## Alcance y límites de esta auditoría

- Se revisó el código fuente del frontend, las respuestas HTTP y el HTML publicado de la home, sitemap, robots y ruta admin.
- No se modificaron archivos fuera de este documento.
- Search Console, Cloudflare y Railway no se administraron desde esta auditoría; sus estados se tomaron del contexto proporcionado y de las respuestas públicas observables.
- No hay métricas de campo de Core Web Vitals en este documento. La medición automática con la API pública de PageSpeed no estuvo disponible por límite de cuota (HTTP 429).
