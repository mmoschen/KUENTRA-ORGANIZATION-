import { Transform, Type } from "class-transformer";
import { IsEmpty, IsIn, IsInt, IsISO8601, IsOptional, IsString, Length, MaxLength, Min, Max } from "class-validator";

const trim = ({ value }: { value: unknown }) => typeof value === "string" ? value.trim() : value;

export class CreateReviewDto {
  @Transform(trim)
  @IsString()
  @Length(2, 80)
  displayName!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Transform(trim)
  @IsString()
  @Length(12, 1000)
  comment!: string;

  @IsISO8601()
  startedAt!: string;

  @IsOptional()
  @IsEmpty()
  website?: string;
}

export class UpdateReviewStatusDto {
  @IsIn(["APPROVED", "REJECTED"])
  status!: "APPROVED" | "REJECTED";
}

export class ReviewStatusQueryDto {
  @IsOptional()
  @IsIn(["PENDING", "APPROVED", "REJECTED"])
  status?: "PENDING" | "APPROVED" | "REJECTED";
}
