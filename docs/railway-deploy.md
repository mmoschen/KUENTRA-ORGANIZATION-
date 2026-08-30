# Despliegue en Railway

El proyecto se publica como tres servicios dentro del mismo proyecto de Railway:

1. **PostgreSQL**: almacena opiniones y su estado de moderación.
2. **API**: NestJS, precios de referencia, formulario y panel de moderación.
3. **Web**: Next.js, sitio público y rutas protegidas del panel.

Los dos servicios de aplicación deben conservar la raíz del repositorio como directorio de código. Los Dockerfiles usan el monorepo completo porque comparten `packages/shared`.

## 1. Crear PostgreSQL

En el proyecto de Railway, agregá una base **PostgreSQL**. No hace falta crear tablas manualmente: la API ejecuta la migración antes de cada despliegue.

## 2. Crear el servicio `api`

Creá un servicio desde este repositorio y configurá:

| Ajuste | Valor |
| --- | --- |
| Ruta del Dockerfile | `backend/api/Dockerfile` |
| Healthcheck | `/health` |
| Comando previo al despliegue | `node backend/api/dist/migrate.js` |
| Volumen | `/app/data` |

Variables requeridas:

```dotenv
NODE_ENV=production
RAILWAY_DOCKERFILE_PATH=backend/api/Dockerfile
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
ADMIN_API_KEY=<secreto-aleatorio-largo>
IP_HASH_SALT=<secreto-aleatorio-largo>
REVIEW_UPLOAD_DIR=/app/data/reviews
```

Generá un dominio público para este servicio. Guardalo: se utiliza en las dos variables de URL de la web. El volumen conserva las capturas privadas de las entregas entre despliegues.

## 3. Crear el servicio `web`

Creá otro servicio desde el mismo repositorio y configurá:

| Ajuste | Valor |
| --- | --- |
| Ruta del Dockerfile | `frontend/web/Dockerfile` |
| Healthcheck | `/api/health` |

Variables requeridas:

```dotenv
NODE_ENV=production
RAILWAY_DOCKERFILE_PATH=frontend/web/Dockerfile
KUENTRA_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_KUENTRA_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
ADMIN_API_KEY=<el-mismo-valor-configurado-en-api>
ADMIN_SESSION_SECRET=<secreto-aleatorio-de-32-caracteres-o-mas>
ADMIN_PASSWORD_HASH=<hash-scrypt-del-panel>
```

Los ejemplos asumen que los servicios se llaman `Postgres`, `api` y `web`; Railway autocompleta el nombre real del servicio al crear cada referencia. `NEXT_PUBLIC_KUENTRA_API_URL` se incorpora al build de Next.js. Configurala antes del primer deploy y redeployá la web si cambia la URL de la API. `KUENTRA_API_URL` se utiliza únicamente del lado del servidor para las rutas administrativas.

Para crear el hash de administrador localmente:

```bash
npm run admin:hash --workspace=@kuentra/api
```

Pegá el hash completo como valor secreto; no uses una variable `NEXT_PUBLIC_` para ninguna credencial.

## Orden recomendado y comprobación

1. Desplegá PostgreSQL y luego la API.
2. Confirmá `https://<dominio-api>/health`: debe devolver `{ "status": "ok" }`.
3. Configurá las URLs finales y secretos de la web; desplegala.
4. Confirmá `https://<dominio-web>/api/health` y enviá una opinión de prueba.
5. Ingresá a `/admin/opiniones`, aprobala y verificá que aparezca en el sitio público.

Para reducir despliegues innecesarios, podés configurar rutas de observación en Railway: `backend/api/**` y `packages/shared/**` para la API; `frontend/web/**` y `packages/shared/**` para la web. Incluí también `package.json` y `package-lock.json` en ambos servicios.

## Seguridad operativa

- Marcá como secretos `ADMIN_API_KEY`, `ADMIN_SESSION_SECRET`, `ADMIN_PASSWORD_HASH` e `IP_HASH_SALT`.
- No publiques `DATABASE_URL` ni montes el volumen de capturas en la web.
- Mantené el mismo `ADMIN_API_KEY` únicamente entre API y web; rotalo en ambos servicios al mismo tiempo si fuera necesario.
- `CORS_ORIGIN` admite varios dominios separados por comas, útil para incluir un dominio temporal de Railway durante una migración.
