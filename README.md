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

Para ver los precios oficiales estimados actualizados, iniciar también la API en otra terminal:

```bash
npm run dev --workspace=@kuentra/api
```

## Despliegue

La guía completa para Railway, con PostgreSQL, variables, health checks, migraciones y volumen privado de capturas está en [`docs/railway-deploy.md`](docs/railway-deploy.md).

Los precios Kuentra siguen centralizados como datos comerciales. La referencia oficial se calcula con el tipo de cambio vendedor del BCRA y la percepción vigente para servicios del exterior. Checkout, autenticación, pagos, pedidos y base de datos quedan fuera de alcance.
