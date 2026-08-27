# Kuentra API

API NestJS independiente para datos de referencia de precios.

`GET /pricing/reference` consulta el tipo de cambio minorista promedio vendedor del BCRA (variable 4), lo cachea durante 12 horas y devuelve también la percepción vigente para servicios del exterior. No persiste datos ni expone precios propios.

```bash
npm run dev --workspace=@kuentra/api
```

La API queda en `http://localhost:4000`. En producción, configurar `KUENTRA_API_URL` en el frontend con la URL pública de la API.
