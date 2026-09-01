# Contexto del proyecto para Codex

## Objetivo actual

Kuentra es una plataforma argentina de servicios digitales. La primera etapa busca validar una HOME de calidad editorial que combine landing comercial y presentación de catálogo, sin parecer un ecommerce tradicional ni una página de reventa de cuentas.

La referencia de composición es Restate. Se toman su jerarquía, ritmo, navegación flotante, bordes finos, uso del espacio y microinteracciones; no sus colores, ilustraciones ni identidad.

## Arquitectura del repositorio

```text
KUENTRA-ORGANIZATION/
├── frontend/
│   └── web/             # Next.js + TypeScript + Tailwind CSS
├── backend/
│   └── api/             # futura API independiente NestJS
├── packages/
│   └── shared/          # contratos tipados compartidos
├── docs/
│   └── design-reference # documentación visual fuera del bundle
└── package.json         # workspaces y scripts raíz
```

Arquitectura futura prevista:

```text
Next.js → NestJS API
```

El frontend podrá desplegarse en Vercel y el backend en Railway con ciclos independientes.

## Estado implementado

- HOME completa y responsive.
- App Router con Server Components por defecto.
- Design system centralizado en `frontend/web/app/globals.css`.
- Paleta Kuentra: navy profundo, azul principal, celeste, blanco azulado y grises fríos.
- Mocks de productos centralizados en `frontend/web/data/products.ts`.
- Contratos `Product` y `Plan` en `packages/shared/src/index.ts`.
- Componentes reutilizables para navegación, hero, cards, secciones editoriales, FAQ, CTA y footer.
- Metadata, Open Graph base, robots y sitemap.
- Estructura de API preparada, sin backend funcional.

## Decisiones visuales

- Space Grotesk para titulares y Manrope para texto.
- Titulares de escala amplia y tracking cerrado.
- Azul usado como acento, no como fondo dominante.
- Cards editoriales con información alineada, bordes finos y hover discreto.
- Hero con grilla técnica sutil y una visual orbital propia de servicios.
- Animación reducida automáticamente si el usuario prefiere menos movimiento.

## Límites de esta etapa

No implementar todavía carrito, checkout, Mercado Pago, autenticación, usuarios, pedidos, pagos, stock, webhooks, panel administrativo ni entrega automática.

## Pendientes antes de producción

1. Reemplazar los enlaces de WhatsApp de muestra (`5491100000000`) por el número oficial.
2. El isotipo oficial extraído de la referencia está integrado como PNG transparente. Reemplazarlo por el archivo vectorial original cuando esté disponible para máxima fidelidad y escalabilidad.
3. Reemplazar precios y testimonios mock por datos aprobados.
4. Crear páginas `/productos` y `/productos/[slug]` únicamente después de validar visualmente la HOME.
5. Agregar imagen Open Graph y favicon definitivos derivados del asset oficial.

## Comandos

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
```

La aplicación local queda disponible en `http://localhost:3000` durante `npm run dev`.
