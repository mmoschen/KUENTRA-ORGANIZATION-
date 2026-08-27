# Kuentra API

API NestJS para referencias de precio y opiniones verificadas.

## Opiniones

- `POST /reviews`: recibe nombre, estrellas, comentario y una captura opcional. Toda opinión se guarda inicialmente como `PENDING`.
- `GET /reviews`: expone únicamente opiniones `APPROVED`.
- Las rutas `/reviews/admin/*` requieren `x-admin-api-key`; el frontend las consume sólo desde sus rutas de servidor protegidas.
- Se aplica validación estricta, honeypot, espera mínima del formulario, límite global de peticiones, máximo de 3 envíos por IP/día y carga de imágenes JPG/PNG/WEBP de hasta 5 MB validada por contenido.

## Desarrollo

```bash
npm run dev --workspace=@kuentra/api
```

Copiá `.env.example` a `.env` y configurá PostgreSQL. Para crear las tablas:

```bash
npm run db:migrate --workspace=@kuentra/api
```

Para generar el hash de la contraseña del panel:

```bash
npm run admin:hash --workspace=@kuentra/api
```

## Railway

1. Creá un servicio PostgreSQL en el mismo proyecto y asigná su `DATABASE_URL` al servicio API.
2. En la API, configurá `CORS_ORIGIN` con el dominio público del frontend, `ADMIN_API_KEY`, `IP_HASH_SALT` y `REVIEW_UPLOAD_DIR=/app/data/reviews`.
3. Adjuntá un volumen a la API en `/app/data`; las capturas quedan privadas y sólo se consultan desde el panel.
4. Ejecutá `npm run db:migrate --workspace=@kuentra/api` como comando previo al despliegue de la API.
5. En el frontend, configurá `KUENTRA_API_URL` para las llamadas de servidor, `NEXT_PUBLIC_KUENTRA_API_URL` con la URL pública de la API y las tres variables de administración indicadas en `frontend/web/.env.example`.

La API queda en `http://localhost:4000` durante desarrollo.
