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

RUN npm run build --workspace=@kuentra/api

FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/backend/api/dist ./backend/api/dist
COPY --from=builder /app/packages/shared ./packages/shared

USER node

EXPOSE 4000

CMD ["node", "backend/api/dist/main.js"]
