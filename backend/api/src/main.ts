import "reflect-metadata";
import "dotenv/config";
import { Controller, Get, Module, ServiceUnavailableException } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { APP_GUARD } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import helmet from "helmet";
import type { OfficialDollarRate } from "@kuentra/shared";
import { ApiRateLimitGuard } from "./api-rate-limit.guard.js";
import { RateLimitService } from "./rate-limit.service.js";

const BCRA_VARIABLES_URL = "https://api.bcra.gob.ar/estadisticas/v4.0/monetarias?categoria=Principales%20Variables&limit=1000";
const CACHE_DURATION_MS = 12 * 60 * 60 * 1000;
const FOREIGN_SERVICE_PERCEPTION_RATE = 0.3;

type BcraResponse = {
  results: Array<{
    idVariable: number;
    ultFechaInformada: string;
    ultValorInformado: number;
  }>;
};

let cachedRate: OfficialDollarRate | undefined;
let cacheValidUntil = 0;

async function getOfficialDollarRate(): Promise<OfficialDollarRate> {
  if (cachedRate && Date.now() < cacheValidUntil) return cachedRate;

  const response = await fetch(BCRA_VARIABLES_URL, { headers: { "Accept-Language": "es-AR" } });
  if (!response.ok) throw new ServiceUnavailableException("No se pudo consultar la cotización del BCRA.");

  const payload = await response.json() as BcraResponse;
  const officialDollar = payload.results.find((variable) => variable.idVariable === 4);
  if (!officialDollar) throw new ServiceUnavailableException("El BCRA no devolvió la cotización oficial.");

  cachedRate = {
    source: "BCRA",
    arsPerUsd: officialDollar.ultValorInformado,
    foreignServicePerceptionRate: FOREIGN_SERVICE_PERCEPTION_RATE,
    rateDate: officialDollar.ultFechaInformada,
    fetchedAt: new Date().toISOString(),
  };
  cacheValidUntil = Date.now() + CACHE_DURATION_MS;
  return cachedRate;
}

@Controller("pricing")
class PricingController {
  @Get("reference")
  getReferencePrice(): Promise<OfficialDollarRate> {
    return getOfficialDollarRate();
  }
}

@Controller()
class HealthController {
  @Get("health")
  getHealth() {
    return { status: "ok" };
  }
}

@Module({
  controllers: [HealthController, PricingController],
  providers: [
    RateLimitService,
    {
      provide: APP_GUARD,
      useFactory: (rateLimit: RateLimitService) => new ApiRateLimitGuard(rateLimit),
      inject: [RateLimitService],
    },
  ],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim()) ?? ["http://localhost:3000"];
  app.set("trust proxy", 1);
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.enableCors({
    origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => callback(null, !origin || allowedOrigins.includes(origin)),
    methods: ["GET"],
    allowedHeaders: ["Content-Type"],
    maxAge: 86_400,
  });
  await app.listen(Number(process.env.PORT ?? 4000));
}

void bootstrap();
