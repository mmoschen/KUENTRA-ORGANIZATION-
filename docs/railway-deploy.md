# Despliegue en Railway

El proyecto se publica como dos servicios dentro del mismo proyecto de Railway:

1. **API**: NestJS para precios de referencia.
2. **Web**: Next.js para el sitio público.

Ambos servicios deben conservar la raíz del repositorio como directorio de código, ya que los Dockerfiles usan el monorepo completo y comparten `packages/shared`.

## 1. Crear el servicio `api`

Creá un servicio desde el repositorio y configurá:

- Dockerfile: `backend/api/Dockerfile`
- Health check: `/health`

Variables:

```env
NODE_ENV=production
RAILWAY_DOCKERFILE_PATH=backend/api/Dockerfile
CORS_ORIGIN=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
```

## 2. Crear el servicio `web`

Creá otro servicio desde el mismo repositorio y configurá:

- Dockerfile: `frontend/web/Dockerfile`
- Health check: `/api/health`

Variables:

```env
NODE_ENV=production
RAILWAY_DOCKERFILE_PATH=frontend/web/Dockerfile
KUENTRA_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
```

Railway completa el nombre real del servicio cuando se crea la referencia. `KUENTRA_API_URL` se utiliza del lado del servidor.

## Orden recomendado y comprobación

1. Desplegá la API.
2. Confirmá `https://<dominio-api>/health`: debe devolver `{ "status": "ok" }`.
3. Configurá la URL de la API y desplegá la web.
4. Confirmá `https://<dominio-web>/api/health` y revisá la home y el catálogo.

Para reducir despliegues innecesarios, podés configurar rutas de observación en Railway: `backend/api/**` y `packages/shared/**` para la API; `frontend/web/**` y `packages/shared/**` para la web. Incluí también `package.json` y `package-lock.json` en ambos servicios.

## Configuración operativa

- `CORS_ORIGIN` admite varios dominios separados por comas.
- Actualizá `KUENTRA_API_URL` si cambia el dominio público de la API.
- Conservá `/health` y `/api/health` como comprobaciones de disponibilidad.
