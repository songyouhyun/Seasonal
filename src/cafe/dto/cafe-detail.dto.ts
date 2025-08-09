import { Lineup } from "generated/prisma";
import { CafeWithLineup } from "../types/cafe-with-lineup";

export class CafeDetailDto {
  id: number;
  name: string;
  address: string;
  lineup: Lineup[];

  static from(cafe: CafeWithLineup): CafeDetailDto {
    const dto = new CafeDetailDto();
    dto.id = cafe.id;
    dto.name = cafe.name;
    dto.address = cafe.address;
    dto.lineup = cafe.lineup;
    return dto;
  }
}