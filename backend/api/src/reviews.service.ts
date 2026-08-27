import { Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import { access, mkdir, writeFile } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join, resolve } from "node:path";
import { DatabaseService } from "./database.service.js";
import type { CreateReviewDto, UpdateReviewStatusDto } from "./reviews.dto.js";

type ReviewRow = {
  id: string;
  display_name: string;
  rating: number;
  comment: string;
  proof_filename: string | null;
  proof_mime_type: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  created_at: Date;
  reviewed_at: Date | null;
  reviewed_by: string | null;
};

const MAX_REVIEW_FILE_SIZE = 5 * 1024 * 1024;
const proofExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

@Injectable()
export class ReviewsService {
  private readonly uploadDirectory = resolve(process.env.REVIEW_UPLOAD_DIR ?? "uploads/reviews");
  private readonly ipHashSalt = process.env.IP_HASH_SALT ?? "local-development-only-salt";

  constructor(private readonly database: DatabaseService) {}

  async create(dto: CreateReviewDto, file: Express.Multer.File | undefined, ip: string) {
    const startedAt = new Date(dto.startedAt).getTime();
    const elapsed = Date.now() - startedAt;
    if (elapsed < 2_500 || elapsed > 2 * 60 * 60 * 1000) {
      throw new Error("No se pudo validar el envío. Recargá la página e intentá otra vez.");
    }

    let proofFilename: string | undefined;
    if (file) {
      if (file.size > MAX_REVIEW_FILE_SIZE || !proofExtensions[file.mimetype]) {
        throw new Error("La captura debe ser JPG, PNG o WEBP y pesar hasta 5 MB.");
      }
      await mkdir(this.uploadDirectory, { recursive: true });
      proofFilename = `${randomUUID()}.${proofExtensions[file.mimetype]}`;
      await writeFile(join(this.uploadDirectory, proofFilename), file.buffer, { flag: "wx" });
    }

    const id = randomUUID();
    const ipHash = createHash("sha256").update(`${this.ipHashSalt}:${ip}`).digest("hex");
    await this.database.query(
      `INSERT INTO reviews (id, display_name, rating, comment, proof_filename, proof_mime_type, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, dto.displayName, dto.rating, dto.comment, proofFilename ?? null, file?.mimetype ?? null, ipHash],
    );
    return { id, status: "PENDING" as const };
  }

  async listApproved() {
    const { rows } = await this.database.query<ReviewRow>(
      `SELECT id, display_name, rating, comment, created_at FROM reviews
       WHERE status = 'APPROVED' ORDER BY created_at DESC LIMIT 12`,
    );
    return rows.map((review) => this.toPublicReview(review));
  }

  async listForAdmin(status?: string) {
    const { rows } = await this.database.query<ReviewRow>(
      `SELECT id, display_name, rating, comment, proof_filename, proof_mime_type, status, created_at, reviewed_at, reviewed_by
       FROM reviews ${status ? "WHERE status = $1" : ""} ORDER BY created_at DESC LIMIT 100`,
      status ? [status] : [],
    );
    return rows.map((review) => ({
      id: review.id,
      displayName: review.display_name,
      rating: review.rating,
      comment: review.comment,
      status: review.status,
      hasProof: Boolean(review.proof_filename),
      createdAt: review.created_at,
      reviewedAt: review.reviewed_at,
      reviewedBy: review.reviewed_by,
    }));
  }

  async updateStatus(id: string, dto: UpdateReviewStatusDto, reviewedBy: string) {
    const { rows } = await this.database.query<ReviewRow>(
      `UPDATE reviews SET status = $2, reviewed_at = NOW(), reviewed_by = $3
       WHERE id = $1
       RETURNING id, display_name, rating, comment, proof_filename, proof_mime_type, status, created_at, reviewed_at, reviewed_by`,
      [id, dto.status, reviewedBy],
    );
    if (!rows[0]) throw new NotFoundException("No se encontró la opinión.");
    return { id: rows[0].id, status: rows[0].status };
  }

  async getProof(id: string) {
    const { rows } = await this.database.query<Pick<ReviewRow, "proof_filename" | "proof_mime_type">>(
      "SELECT proof_filename, proof_mime_type FROM reviews WHERE id = $1",
      [id],
    );
    const proof = rows[0];
    if (!proof?.proof_filename || !proof.proof_mime_type) throw new NotFoundException("No hay una captura para esta opinión.");

    const filePath = join(this.uploadDirectory, proof.proof_filename);
    try {
      await access(filePath);
    } catch {
      throw new NotFoundException("No se encontró la captura asociada.");
    }

    return { stream: createReadStream(filePath), mimeType: proof.proof_mime_type };
  }

  private toPublicReview(review: ReviewRow) {
    return {
      id: review.id,
      displayName: review.display_name,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.created_at,
    };
  }
}
