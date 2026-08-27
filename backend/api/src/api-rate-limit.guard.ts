import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import type { Request } from "express";
import { RateLimitService } from "./rate-limit.service.js";

@Injectable()
export class ApiRateLimitGuard implements CanActivate {
  constructor(private readonly rateLimit: RateLimitService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    this.rateLimit.assertAllowed(`api:${request.ip ?? "unknown"}`, 120, 60_000);
    return true;
  }
}
