import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class GetCafesQueryDto {
  /**
   * 라인업이 있는 카페만 볼지 여부
   * 예: /cafes?hasLineup=true
   */
  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : undefined))
  @IsBoolean()
  hasLineup?: boolean;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 10))
  @IsInt()
  @Min(1) @Max(100)
  limit = 10;

  @IsOptional()
  @Transform(({ value }) => Number(value ?? 0))
  @IsInt()
  @Min(0)
  offset = 0;
}
