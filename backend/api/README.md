# Kuentra API

API NestJS liviana para la referencia de cotización utilizada por el catálogo.

## Endpoints

- `GET /health`: estado del servicio.
- `GET /pricing/reference`: cotización oficial y percepción usada por el frontend.

## Desarrollo

```bash
npm run dev --workspace=@kuentra/api
```

Copiá `.env.example` a `.env` y configurá el origen permitido del frontend.
La API queda disponible en `http://localhost:4000` durante el desarrollo.
