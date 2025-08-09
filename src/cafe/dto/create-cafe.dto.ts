import { IsString } from "class-validator";

export class CreateCafeDto {
  @IsString()
  name: string;

  @IsString()
  address: string;
}
