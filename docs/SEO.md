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
| 2026-08-30 | Deshabilitación del header `X-Powered-By` mediante `poweredByHeader: false`. | `frontend/web/next.config.ts`, `docs/SEO.md` | Reducir la exposición de tecnología en las respuestas HTTP sin modificar metadata, Schema, sitemap, robots, URLs, contenido ni diseño. | Completado |

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

## 9. Análisis de arquitectura de páginas públicas de servicios

**Estado:** análisis realizado el 2026-08-30; no se crearon rutas, no se modificó código y no se considera una implementación SEO.

### Conclusión

El catálogo actual tiene seis servicios, pero sus fichas reúnen, en general, el nombre, una descripción breve, planes, duración y precio. Esa información es útil para elegir dentro de la home, pero no alcanza por sí sola para justificar seis páginas indexables: repetirla en una URL propia produciría contenido escaso y muy similar a las tarjetas.

No se recomienda publicar nuevas páginas ahora. Cuando exista contenido específico aprobado, los primeros candidatos son `ChatGPT Plus` y `CapCut Pro`: ambos tienen más de una alternativa de plan y una intención de consulta más diferenciable dentro del catálogo. El resto debe mantenerse únicamente en la home hasta que se pueda documentar información propia, exacta y revisada. Esta recomendación no implica afirmar volumen de búsqueda ni disponibilidad comercial fuera de lo ya publicado por Kuentra.

### Arquitectura propuesta

Si se aprueban los contenidos necesarios, usar el espacio de nombres `/servicios/` es preferible a rutas de primer nivel. Agrupa el catálogo, comunica que la URL pertenece a Kuentra —no a la marca de terceros— y permite crecer sin convertir la raíz en un listado de marcas.

```text
/
/servicios/chatgpt-plus          (candidato de primera etapa; no crear aún)
/servicios/capcut-pro            (candidato de primera etapa; no crear aún)
```

No crear por ahora una landing `/servicios/`: duplicaría la función del catálogo de la home si solo repite tarjetas. Evaluarla únicamente cuando haya, como mínimo, varias fichas publicadas y contenido de navegación propio. Tampoco crear ahora rutas para Gemini, Canva, Perplexity ni Disney+.

La home debe conservar la intención amplia de “servicios digitales” y seguir siendo el catálogo comparativo. Cuando una ficha individual se publique, el enlace de su tarjeta debe llevar a su URL; la tarjeta conservará una síntesis breve y la página desarrollará contenido original. Las tarjetas de servicios sin ficha deben continuar llevando al contacto. No cambiar esos enlaces en esta etapa.

Los breadcrumbs no son necesarios mientras no exista una landing `/servicios/`. Si esa landing se crea en el futuro, las fichas podrían usar `Inicio > Servicios > [servicio]` y marcar el último elemento como página actual; hasta entonces, es preferible omitirlos antes que construir una jerarquía ficticia.

### Evaluación por servicio

| Servicio actual | Posible slug | Intención que podría cubrir | ¿Justifica una URL con el contenido actual? | Contenido adicional verificable necesario | Riesgos | Título SEO y H1 tentativos | CTA | Sitemap, canonical y prioridad |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| ChatGPT Plus | `chatgpt-plus` | Consulta sobre acceder a ChatGPT Plus mediante Kuentra, con alternativas compartida e individual. | No todavía; es el candidato más fuerte cuando se apruebe contenido propio. | Explicación concreta de qué ofrece Kuentra para cada alternativa publicada, a quién puede servir según los usos ya indicados (estudiar, trabajar y crear), duración, diferencias confirmadas entre planes, pasos de activación aplicables al producto y alcance del acompañamiento. | Alto de thin content si solo replica las dos frases y planes de la tarjeta; duplicación con la home si se reutiliza el mismo texto; no afirmar funciones, límites o condiciones de ChatGPT que Kuentra no haya validado. | `ChatGPT Plus con Kuentra | Kuentra`; H1: `ChatGPT Plus con Kuentra`. | `Consultar por WhatsApp sobre ChatGPT Plus`. | Incluir solo al publicarse con contenido aprobado; canonical `https://kuentra.com.ar/servicios/chatgpt-plus`; prioridad de implementación P1. |
| Gemini Pro | `gemini-pro` | Consulta sobre Gemini Pro para ideas, análisis, investigación, redacción y tareas complejas a través de Kuentra. | No. La ficha actual solo define un plan individual y una descripción genérica. | Alcance confirmado de la alternativa ofrecida, explicación comprobable de la mención a Google One, proceso específico de activación y contenido propio que no replique la tarjeta. | Alto de thin content; alto de duplicación con la home; riesgo de presentar como característica vigente algo que no esté aprobado o que cambie en el servicio de terceros. | `Gemini Pro con Kuentra | Kuentra`; H1: `Gemini Pro con Kuentra`. | `Consultar por WhatsApp sobre Gemini Pro`. | No incluir ni crear por ahora; canonical futuro `https://kuentra.com.ar/servicios/gemini-pro`; prioridad P2 condicionada a contenido aprobado. |
| CapCut Pro | `capcut-pro` | Consulta sobre CapCut Pro para edición de video y contenido para redes mediante Kuentra. | No todavía; es el segundo candidato cuando se pueda describir el servicio de forma propia. | Descripción específica y aprobada de las alternativas mensual y trimestral, usos ya publicados (edición de video y redes), proceso de activación aplicable, y aclaraciones comerciales confirmadas que distingan ambas duraciones. | Alto de thin content si se limita a precio y duración; duplicación con el resumen de la home; no enumerar herramientas premium, recursos ni compatibilidades que no estén documentados por Kuentra. | `CapCut Pro con Kuentra | Kuentra`; H1: `CapCut Pro con Kuentra`. | `Consultar por WhatsApp sobre CapCut Pro`. | Incluir solo al publicarse con contenido aprobado; canonical `https://kuentra.com.ar/servicios/capcut-pro`; prioridad P1. |
| Canva Pro | `canva-pro` | Consulta sobre Canva Pro para diseñar piezas y usar recursos de marca mediante Kuentra. | No. Además, los datos actuales requieren validación: `planOptions` muestra 1 y 3 meses, pero el listado de planes solo contiene un plan de 1 mes. | Resolución de esa diferencia antes de publicar, detalle aprobado de las duraciones realmente ofrecidas, explicación propia de los usos publicados y activación específica. | Alto de thin content y duplicación; riesgo de publicar una duración o condición que no coincida con el catálogo vigente. | `Canva Pro con Kuentra | Kuentra`; H1: `Canva Pro con Kuentra`. | `Consultar por WhatsApp sobre Canva Pro`. | No incluir ni crear por ahora; canonical futuro `https://kuentra.com.ar/servicios/canva-pro`; prioridad P2 después de corregir/validar los datos. |
| Perplexity Pro | `perplexity-pro` | Consulta sobre Perplexity Pro para investigación y búsqueda asistida con fuentes mediante Kuentra. | No. Tiene un único plan y el texto actual es insuficiente para un documento independiente. | Información propia y confirmada sobre el servicio que Kuentra entrega, activación, duración y ejemplos de uso limitados a investigación, comparación y aprendizaje ya publicados. | Alto de thin content; duplicación casi total con la tarjeta; evitar promesas sobre precisión, fuentes o resultados. | `Perplexity Pro con Kuentra | Kuentra`; H1: `Perplexity Pro con Kuentra`. | `Consultar por WhatsApp sobre Perplexity Pro`. | No incluir ni crear por ahora; canonical futuro `https://kuentra.com.ar/servicios/perplexity-pro`; prioridad P3. |
| Disney+ Premium 4K | `disney-plus` | Consulta sobre la alternativa Disney+ Premium 4K publicada por Kuentra, con Disney, ESPN y F1. | No. Solo hay un plan compartido y una descripción breve. | Alcance comercial y de activación revisado, condiciones exactas del plan compartido que sea lícito comunicar, duración y una descripción original confirmada. | Muy alto de thin content y duplicación; sensibilidad comercial y de marca por describir una cuenta compartida; no crear una página hasta contar con revisión comercial/legal del contenido. | `Disney+ Premium 4K con Kuentra | Kuentra`; H1: `Disney+ Premium 4K con Kuentra`. | `Consultar por WhatsApp sobre Disney+ Premium 4K`. | No incluir ni crear por ahora; canonical futuro `https://kuentra.com.ar/servicios/disney-plus`; prioridad no programada. |

Los títulos son borradores de arquitectura, no metadata aprobada. Deben ajustarse junto con una description propia y natural de cada página, evitando precios dinámicos, afirmaciones no confirmadas y repetición de la metadata de la home.

### Requisitos comunes antes de indexar una ficha

- Contenido original suficiente para explicar el servicio de Kuentra, no una reproducción de la tarjeta, de la FAQ global ni del sitio de la marca de terceros.
- Revisión comercial/legal de cada afirmación, plan, duración y modalidad publicada; no añadir precios, garantías, comparaciones, soporte, entrega, testimonios ni preguntas frecuentes que no estén confirmados.
- Metadata propia: título, description, Open Graph/Twitter y una canonical absoluta autorreferente. La home mantiene `https://kuentra.com.ar/` como canonical y cada ficha usa solamente la suya.
- Inclusión en `app/sitemap.ts` solo tras ser indexable; usar una fecha de cambio real o no declarar `lastModified` hasta disponer de una fuente confiable. No incluir anclas ni rutas no publicadas.
- Enlazado interno desde la tarjeta correspondiente y, si se crean, desde una navegación contextual. Mantener el texto de la home como resumen y el de la ficha como desarrollo para evitar canibalización entre “servicios digitales” y cada servicio concreto.
- No añadir datos estructurados de `Product`, `Offer`, precios, reseñas o valoraciones sin datos confirmados. A futuro, una página publicada podría evaluar `WebPage` y, solo si hay breadcrumbs reales, `BreadcrumbList`, enlazados a la `Organization` existente.

### Orden sugerido de implementación futura

1. Validar con negocio/comercial la información específica disponible para ChatGPT Plus y CapCut Pro; si no alcanza para contenido original, mantenerlos en la home.
2. Crear y revisar una sola ficha piloto, preferentemente `/servicios/chatgpt-plus`, con contenido aprobado, metadata, canonical, enlace interno y sitemap en la misma etapa.
3. Medir indexación, consultas y posible solapamiento con la home antes de publicar `/servicios/capcut-pro`.
4. Resolver la discrepancia de duraciones de Canva Pro y obtener contenido específico para Gemini, Canva y Perplexity antes de reevaluarlos.
5. Dejar Disney+ Premium 4K como sección de la home hasta contar con revisión comercial/legal y contenido diferencial suficiente.

No se debe publicar una URL individual solo para captar el nombre de una marca o una combinación de keywords. Si los requisitos anteriores no se cumplen, la arquitectura correcta sigue siendo una única home con sus seis secciones de catálogo.

## 10. Especificación de contenido piloto: ChatGPT Plus

**Estado:** especificación editorial realizada el 2026-08-30. La ruta propuesta `/servicios/chatgpt-plus` no existe, no se creó código y esta sección no constituye una implementación ni una aprobación de publicación.

### A. Información confirmada en el proyecto

| Tema | Información confirmada | Fuente |
| --- | --- | --- |
| Nombre y categoría | El catálogo nombra el servicio `ChatGPT Plus` y lo clasifica en `IA`. | `frontend/web/data/products.ts` |
| Descripción actual | La ficha dice: “Tu asistente de IA para estudiar, trabajar y crear” y “Accedé a funciones avanzadas de inteligencia artificial con acompañamiento real de Kuentra”. | `frontend/web/data/products.ts` |
| Modalidades | El catálogo contiene dos alternativas: `Compartido` e `Individual`. | `frontend/web/data/products.ts` |
| Duración | Ambas alternativas publicadas indican `1 mes`. | `frontend/web/data/products.ts` |
| Presencia en catálogo | Es el primer producto destacado y muestra la etiqueta editorial `Más elegido`. La etiqueta existe en la interfaz, pero no debe usarse como afirmación de popularidad en una nueva página sin evidencia comercial. | `frontend/web/data/products.ts`, `frontend/web/components/product-card.tsx` |
| Proceso general de Kuentra | La home describe el siguiente flujo general: elegir el servicio; coordinar el pago, plan, valor y detalles; recibir el acceso con guía durante la activación. | `frontend/web/components/sections.tsx` |
| Activación general | La FAQ indica que, después de coordinar el pago, Kuentra guía por WhatsApp y envía instrucciones de activación. También indica que la mayoría de los servicios se activa en el día, pero que el tiempo exacto depende del producto y se informa antes de confirmar. | `frontend/web/data/content.ts` |
| Soporte general | La FAQ afirma que el soporte continúa después de la activación ante inconvenientes durante la vigencia del servicio. | `frontend/web/data/content.ts` |
| CTA y canal actual | La tarjeta de ChatGPT Plus lleva a `#contacto` con la etiqueta accesible “Ver opciones de ChatGPT Plus”. La home ofrece CTAs visibles “Hablar por WhatsApp”; el flujo general también menciona coordinación por WhatsApp. | `frontend/web/components/product-card.tsx`, `frontend/web/components/hero.tsx`, `frontend/web/components/sections.tsx`, `frontend/web/components/site-header.tsx` |
| Contexto de la home | Kuentra se presenta como un sitio de servicios digitales en Argentina y menciona ChatGPT entre las herramientas disponibles desde un solo lugar. | `frontend/web/components/hero.tsx`, `frontend/web/app/layout.tsx` |

Los precios y la referencia de precio presentes en los datos de la tarjeta no se incluyen en esta especificación editorial. No deben trasladarse a una futura página sin confirmar su vigencia, forma de presentación y aprobación comercial en el momento de publicar.

### B. Información faltante o ambigua

- **[REQUIERE CONFIRMACIÓN]** Qué diferencia concreta existe entre las modalidades `Compartido` e `Individual`: forma de acceso, alcance, usuarios, privacidad, límites, restricciones y cualquier condición aplicable.
- **[REQUIERE CONFIRMACIÓN]** Que la duración de un mes y la disponibilidad de ambas modalidades sigan vigentes al publicar.
- **[REQUIERE CONFIRMACIÓN]** Precio vigente, moneda, condiciones de pago y si corresponde mostrar o no una referencia de precio. La página no debe heredar valores estáticos sin validación.
- **[REQUIERE CONFIRMACIÓN]** Aplicación exacta a ChatGPT Plus del proceso general de activación: instrucciones, plazo real, qué se recibe y cualquier requisito previo. La FAQ actual es global; no confirma estos detalles para este producto.
- **[REQUIERE CONFIRMACIÓN]** Alcance, canal, horario y vigencia del acompañamiento y soporte específico de ChatGPT Plus. La promesa actual es general para los servicios de Kuentra.
- **[REQUIERE CONFIRMACIÓN]** Qué “funciones avanzadas” se pueden nombrar. No se deben listar funciones, límites, modelos, compatibilidades ni beneficios de ChatGPT sin una fuente interna aprobada.
- **[REQUIERE CONFIRMACIÓN]** Validez operativa y destino final del enlace de WhatsApp antes de convertirlo en CTA de una página pública.
- **[REQUIERE CONFIRMACIÓN]** Cualquier FAQ específica, testimonio, garantía, condición comercial o afirmación de que es “más elegido”. No hay respaldo específico de ChatGPT Plus en el proyecto.

### Estructura de contenido propuesta

La siguiente estructura usa texto confirmado cuando es posible. Todo texto entre corchetes exige validación antes de convertirse en contenido público.

#### Metadata y encabezado

- **Title SEO tentativo:** `ChatGPT Plus con Kuentra | Kuentra`
- **Meta description tentativa:** `Conocé las alternativas de ChatGPT Plus publicadas por Kuentra: modalidad compartida o individual por 1 mes. Consultá los detalles por WhatsApp.`
- **H1:** `ChatGPT Plus con Kuentra`

El título, la description y el H1 son borradores. Antes de publicar se debe confirmar que la disponibilidad, ambas modalidades y su duración continúan vigentes. La description no debe incorporar precios ni promesas no verificadas.

#### Introducción

> ChatGPT Plus es una de las herramientas de IA del catálogo de Kuentra. Está pensado para estudiar, trabajar y crear, con acompañamiento de Kuentra.

Este texto deriva de las dos descripciones actuales. **[REQUIERE CONFIRMACIÓN]** agregar una explicación más detallada de qué ofrece Kuentra para este servicio sin describir funcionalidades de terceros no aprobadas.

#### Qué incluye

- Modalidad `Compartido` por `1 mes`.
- Modalidad `Individual` por `1 mes`.
- Acompañamiento de Kuentra, según la descripción del catálogo.
- **[REQUIERE CONFIRMACIÓN]** Diferencias entre ambas modalidades.
- **[REQUIERE CONFIRMACIÓN]** Forma de activación, acceso, alcance del acompañamiento y cualquier condición de cada alternativa.

No incluir precios, cantidad de usuarios, características del producto, privacidad, límites ni beneficios adicionales hasta que estén aprobados.

#### Cómo funciona

Usar únicamente el proceso general ya publicado, precedido por una aclaración: “Este es el proceso general de Kuentra; la aplicación exacta a ChatGPT Plus se confirma antes de avanzar.”

1. Elegís el servicio.
2. Coordinás el pago; Kuentra confirma el plan, el valor y cada detalle antes de avanzar.
3. Recibís el acceso; Kuentra guía durante la activación y continúa disponible si necesitás ayuda.

**[REQUIERE CONFIRMACIÓN]** Validar que los tres pasos, las instrucciones por WhatsApp y el soporte posterior aplican sin excepciones a ChatGPT Plus antes de presentarlos como proceso específico de la ficha.

#### Para quién puede servir

> Puede servir a personas que buscan una herramienta de IA para estudiar, trabajar y crear.

La frase refleja el uso declarado en la tarjeta. **[REQUIERE CONFIRMACIÓN]** cualquier perfil más concreto, resultado, caso de uso, sector o beneficio; no se deben añadir ejemplos que no estén documentados.

#### Preguntas frecuentes

Las siguientes preguntas se pueden planificar, pero no deben publicarse como FAQ específica hasta validar sus respuestas:

| Pregunta | Respuesta disponible | Estado |
| --- | --- | --- |
| ¿Qué modalidades de ChatGPT Plus ofrece Kuentra? | Compartido e Individual; ambas figuran con una duración de 1 mes. | Confirmado en el catálogo; confirmar vigencia al publicar. |
| ¿Cómo se coordina la activación? | La FAQ general indica coordinación por WhatsApp e instrucciones de activación después de coordinar el pago. | **[REQUIERE CONFIRMACIÓN]** para ChatGPT Plus. |
| ¿Cuánto demora la activación? | La home dice que la mayoría de los servicios se activa en el día y que el tiempo exacto depende del producto, informado antes de confirmar. | **[REQUIERE CONFIRMACIÓN]** para ChatGPT Plus; no prometer un plazo. |
| ¿Hay soporte después de la activación? | La FAQ general indica soporte durante la vigencia del servicio ante inconvenientes. | **[REQUIERE CONFIRMACIÓN]** de alcance específico para ChatGPT Plus. |
| ¿Cuál es la diferencia entre Compartido e Individual? | No hay explicación en el proyecto. | **[REQUIERE CONFIRMACIÓN]**. |

No utilizar `FAQPage` como datos estructurados mientras las respuestas sean genéricas o estén pendientes de confirmación.

#### CTA final

- **Etiqueta confirmada que puede reutilizarse:** `Hablar por WhatsApp`.
- **Texto de apoyo tentativo:** `Coordiná el plan, el valor y los detalles antes de avanzar.`
- **[REQUIERE CONFIRMACIÓN]** enlace de WhatsApp operativo, contexto específico de la consulta y cualquier mensaje precompletado sobre ChatGPT Plus.

### SEO técnico y enlazado para una futura publicación

- **Canonical esperada:** `https://kuentra.com.ar/servicios/chatgpt-plus`, autorreferente y única. Solo debe declararse cuando la ruta exista y sea indexable.
- **Breadcrumb futuro:** no añadirlo por ahora. Si posteriormente existe una landing real `/servicios/`, usar `Inicio > Servicios > ChatGPT Plus`; sin esa landing, omitir breadcrumbs en lugar de simular una jerarquía.
- **Enlaces internos:** al publicar, la tarjeta de ChatGPT Plus de la home debería enlazar a la ficha y la ficha debe enlazar de vuelta al catálogo de la home. Mantener el resumen breve en la tarjeta y desarrollar contenido original en la ficha para evitar canibalización. No realizar este cambio todavía.
- **Sitemap:** añadir `https://kuentra.com.ar/servicios/chatgpt-plus` solamente en la misma etapa en que la página esté publicada, tenga contenido aprobado y sea indexable. No incluir la ruta propuesta antes ni usar una fecha de modificación artificial.
- **Schema.org posterior:** se podría evaluar `WebPage`, enlazada al `WebSite` y `Organization` ya declarados. Evaluar `BreadcrumbList` únicamente si los breadcrumbs existen de verdad. No usar `Product`, `Offer`, `Review`, `AggregateRating` ni `FAQPage` sin datos específicos y verificados.

### Criterio de salida de la especificación

La ficha piloto queda lista para implementación solo cuando se confirmen las modalidades, condiciones, duración, precio/forma de mostrarlo, flujo de activación, soporte y CTA operativo; se apruebe contenido original suficiente; y se validen metadata, canonical, enlazado interno y sitemap en la misma etapa. Hasta entonces, ChatGPT Plus debe permanecer como tarjeta dentro de la home.

## 11. Auditoría Lighthouse: accesibilidad y prácticas recomendadas

**Estado:** auditoría realizada el 2026-08-30; no se modificó código, diseño ni configuración. Se ejecutó Lighthouse móvil sobre `https://kuentra.com.ar/`, limitado a Accessibility y Best Practices: `Accessibility 92` y `Best Practices 96`, en línea con la medición de referencia. El análisis se limita a ARIA prohibida, contraste y errores de consola; no cubre rendimiento, LCP, JavaScript ni animaciones.

### 11.1 Elementos con atributos ARIA prohibidos

| Componente / archivo | Elemento afectado | Causa | Impacto real | Corrección recomendada | ¿Altera el diseño? | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| `frontend/web/components/reviews-experience.tsx` | Las tres instancias de `<span class="flex gap-0.5" aria-label="Calificación de 5 estrellas">` que agrupan las estrellas de las tarjetas de opiniones. | Un `span` sin rol semántico válido no permite `aria-label`; Lighthouse informa literalmente: “aria-label attribute cannot be used on a span with no valid role attribute”. | Las estrellas se ven, pero su calificación no queda expuesta de forma válida a tecnologías asistivas y la auditoría de accesibilidad falla. No afecta el flujo de compra ni la indexación. | Convertir el agrupador en un elemento con semántica válida para ese nombre, por ejemplo `role="img"` con el `aria-label` existente, o exponer un texto solo para lectores de pantalla y marcar los SVG como decorativos. Elegir una única alternativa y comprobar la lectura con lector de pantalla. | No; el cambio de rol o texto oculto no modifica la apariencia. | Media |

El formulario de opiniones contiene otros `aria-label`, pero no estaba abierto en la carga evaluada y no es la causa de este resultado de Lighthouse. Su revisión debe tratarse en una etapa de accesibilidad separada.

### 11.2 Contraste insuficiente

Lighthouse detectó 51 nodos. Las causas se concentran en opacidades bajas para texto secundario y en el uso de blanco sobre el azul de marca `#4c9ddb`, que no alcanza el contraste exigido. No se trata de un único selector global.

| Componentes / archivos | Elementos afectados y evidencia | Causa | Impacto real | Corrección recomendada | ¿Altera el diseño? | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| `frontend/web/components/product-card.tsx` | 38 nodos en las seis tarjetas: `Precio oficial`, `Actualizando...`, `Kuentra desde`, duración, modalidad, referencia de precio y tarifa. Las clases implicadas son `!text-current/50`, `opacity-45` y `opacity-60`, combinadas con fondos claros o con el fondo azul de la tarjeta destacada. Lighthouse registra relaciones entre `2.77:1` y `4.31:1`; por ejemplo, `Actualizando...` en la tarjeta destacada tiene `3.39:1`. | Las opacidades reducen demasiado el contraste del texto heredado y el azul de marca sobre fondos claros tampoco alcanza 4.5:1 en texto pequeño. | Información de precio, duración y modalidad pierde legibilidad, especialmente en móvil. Afecta a todo el catálogo visible y es el bloque más numeroso de fallos. | Definir colores de texto secundarios accesibles para los dos contextos de tarjeta (clara y destacada), en vez de reducir la opacidad hasta incumplir. Validar por separado el texto normal de 8–14 px y las etiquetas. | Sí, de forma acotada: el texto secundario se verá más contrastado y/o los fondos de sus paneles deberán ajustarse levemente. | Alta |
| `frontend/web/components/sections.tsx` y `frontend/web/components/reviews-experience.tsx` | 10 nodos: `Opiniones / Comunidad`, los tres rótulos `KUENTRA / 01–03`, `Preguntas frecuentes` y los números `01–05` de la FAQ. Usan `text-brand` sobre blanco o `canvas`; Lighthouse mide `2.93:1` y `2.78:1`. | El token `--brand: #4c9ddb` es demasiado claro para tipografía pequeña sobre fondos claros. | Son rótulos auxiliares, pero la lectura en condiciones de baja visión no alcanza el mínimo y la auditoría falla. | Usar un tono de texto de marca más oscuro para etiquetas sobre superficies claras, manteniendo `--brand` para elementos decorativos si se desea. Verificar la nueva relación en blanco y `canvas`. | Sí, leve: los rótulos azules se oscurecerán. | Media |
| `frontend/web/components/sections.tsx` | CTA final: rótulo `Tu próximo servicio digital` (`2.19:1`), H2 `Todo listo para dar el próximo paso` (`2.93:1`, aunque es texto grande requiere 3:1) y enlace `Hablar por WhatsApp` (`2.93:1`) sobre `bg-brand`. | Blanco y blanco al 70 % sobre `#4c9ddb` no alcanzan el contraste requerido. | Afecta el CTA principal de la home y su enlace de contacto; es visualmente relevante y perjudica la lectura. | Oscurecer el fondo del CTA hasta cumplir con texto blanco, o usar una combinación de texto y fondo alternativa que cumpla. Conservar estados de hover y foco con el mismo criterio. | Sí: el panel final cambiará perceptiblemente de tono o de color de texto. | Alta |

No se recomienda resolver estos fallos con opacidad, filtros o sombras únicamente: la combinación final de color y fondo debe superar el umbral de Lighthouse. La corrección debe probarse en móvil y no debe modificar contenido, URLs, metadata, sitemap ni robots.

### 11.3 Errores registrados en la consola

Lighthouse registró exactamente estos dos mensajes, originados por una única solicitud:

```text
Access to fetch at 'https://api-production-8b2ae.up.railway.app/reviews' from origin 'https://kuentra.com.ar' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
Failed to load resource: net::ERR_FAILED
```

| Componente / archivo | Elemento o solicitud afectada | Causa | Impacto real | Corrección recomendada | ¿Altera el diseño? | Prioridad |
| --- | --- | --- | --- | --- | --- | --- |
| `frontend/web/components/reviews-experience.tsx` | `useEffect` ejecuta `fetch(`${NEXT_PUBLIC_KUENTRA_API_URL}/reviews`)` al cargar la home. El bundle publicado resuelve la URL a `https://api-production-8b2ae.up.railway.app/reviews`. | La API de Railway devuelve 200 para la solicitud, pero no envía `Access-Control-Allow-Origin` cuando el origen es `https://kuentra.com.ar`. El backend usa una lista de orígenes desde `CORS_ORIGIN` en `backend/api/src/main.ts`; la configuración desplegada no permite el dominio de producción. | La carga de opiniones reales falla en navegador. El componente captura el error y muestra testimonios de muestra, por lo que la home no se cae; sin embargo, no puede mostrar opiniones remotas. El mismo origen/configuración también bloquearía el POST del formulario de opiniones. Es la causa de la penalización de Best Practices. | Configurar en el entorno de producción de la API `CORS_ORIGIN=https://kuentra.com.ar` (más cualquier otro origen explícitamente autorizado que corresponda), redesplegar la API y verificar con una solicitud que incluya `Origin: https://kuentra.com.ar` y reciba el header permitido. No añadir middleware ni desactivar CORS en el frontend. | No; es una corrección de configuración de la API. | Alta |

El error proviene de una interacción de código propio con la API propia de Kuentra desplegada en Railway: el disparador es el componente cliente y la causa raíz es la configuración externa del backend. No proviene de Cloudflare, una extensión del navegador, Lighthouse ni un recurso de terceros. No apareció en esta ejecución un error de favicon ni otro error de consola independiente.

### Orden recomendado para una futura etapa de corrección

1. Corregir la configuración CORS de la API y comprobar que desaparecen ambos mensajes de consola sin alterar la experiencia visual.
2. Corregir el grupo ARIA de las calificaciones y validar con Lighthouse y lector de pantalla.
3. Definir y validar las combinaciones de color del CTA final y de las tarjetas antes de cambiar estilos; aplicar los cambios de contraste en una etapa visual controlada.
4. Reejecutar Lighthouse móvil para confirmar que Accessibility y Best Practices mejoran, sin abrir una tarea de rendimiento.
