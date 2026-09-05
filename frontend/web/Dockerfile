FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/web/package.json frontend/web/package.json
COPY backend/api/package.json backend/api/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN npm ci

FROM dependencies AS builder

WORKDIR /app

COPY . .

# Las variables requeridas durante el prerender deben estar disponibles en el build.
ARG KUENTRA_API_URL
ENV KUENTRA_API_URL=${KUENTRA_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build --workspace=@kuentra/web

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/frontend/web/public ./frontend/web/public
COPY --from=builder /app/frontend/web/.next/standalone ./
COPY --from=builder /app/frontend/web/.next/static ./frontend/web/.next/static

# Next escribe exclusivamente sus artefactos regenerables en este directorio.
# El resto del runtime conserva la propiedad de root y queda de solo lectura.
RUN install -d -o node -g node -m 0750 /app/frontend/web/.next/cache

USER node

EXPOSE 3000

CMD ["node", "frontend/web/server.js"]
