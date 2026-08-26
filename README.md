# Kuentra

Monorepo para la plataforma de servicios digitales Kuentra.

## Estructura

- `frontend/web`: frontend Next.js, TypeScript y Tailwind CSS.
- `backend/api`: espacio reservado para la API NestJS independiente.
- `packages/shared`: contratos tipados compartidos entre frontend y API.
- `docs/design-reference`: referencias visuales internas; no forman parte del bundle.

## Desarrollo

```bash
npm install
npm run dev
```

La primera iteración implementa únicamente la HOME con datos mock centralizados. Checkout, autenticación, pagos, pedidos y base de datos quedan fuera de alcance.
