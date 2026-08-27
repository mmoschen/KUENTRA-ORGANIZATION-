import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  ParseFilePipeBuilder,
  Query,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import { memoryStorage } from "multer";
import { AdminApiKeyGuard } from "./admin-api-key.guard.js";
import { RateLimitService } from "./rate-limit.service.js";
import { CreateReviewDto, ReviewStatusQueryDto, UpdateReviewStatusDto } from "./reviews.dto.js";
import { ReviewsService } from "./reviews.service.js";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviews: ReviewsService,
    private readonly rateLimit: RateLimitService,
  ) {}

  @Get()
  async listApproved(@Req() request: Request) {
    this.rateLimit.assertAllowed(`reviews-read:${request.ip ?? "unknown"}`, 60, HOUR_MS);
    return this.reviews.listApproved();
  }

  @Post()
  @UseInterceptors(FileInterceptor("proof", {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 8 },
    fileFilter: (_request, file, callback) => {
      callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype));
    },
  }))
  async create(
    @Body() dto: CreateReviewDto,
    @UploadedFile(new ParseFilePipeBuilder()
      .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
      .addFileTypeValidator({ fileType: /(jpg|jpeg|png|webp)$/ })
      .build({ fileIsRequired: false, errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })) file: Express.Multer.File | undefined,
    @Req() request: Request,
  ) {
    const clientIp = request.ip ?? "unknown";
    this.rateLimit.assertAllowed(`reviews-submit:${clientIp}`, 3, DAY_MS);
    try {
      return await this.reviews.create(dto, file, clientIp);
    } catch (error) {
      if (error instanceof Error && (error.message.startsWith("No se pudo") || error.message.startsWith("La captura"))) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @Get("admin")
  @UseGuards(AdminApiKeyGuard)
  async listForAdmin(@Query() query: ReviewStatusQueryDto) {
    return this.reviews.listForAdmin(query.status);
  }

  @Patch("admin/:id")
  @UseGuards(AdminApiKeyGuard)
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateReviewStatusDto,
    @Headers("x-admin-name") adminName = "Administrador",
  ) {
    return this.reviews.updateStatus(id, dto, adminName.slice(0, 80));
  }

  @Get("admin/:id/proof")
  @UseGuards(AdminApiKeyGuard)
  async getProof(@Param("id") id: string, @Res({ passthrough: true }) response: Response) {
    const proof = await this.reviews.getProof(id);
    response.setHeader("Content-Type", proof.mimeType);
    response.setHeader("Content-Disposition", "inline");
    response.setHeader("Cache-Control", "private, no-store");
    return new StreamableFile(proof.stream);
  }
}
