import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { timingSafeEqual } from "node:crypto";

@Injectable()
export class AdminApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const expectedKey = process.env.ADMIN_API_KEY;
    const request = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>();
    const providedKey = request.headers["x-admin-api-key"];

    if (!expectedKey || !providedKey || expectedKey.length !== providedKey.length) {
      throw new UnauthorizedException("No autorizado.");
    }

    const isValid = timingSafeEqual(Buffer.from(expectedKey), Buffer.from(providedKey));
    if (!isValid) throw new UnauthorizedException("No autorizado.");
    return true;
  }
}
