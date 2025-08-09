import { Lineup } from "generated/prisma";
import { CafeWithLineup } from "../types/cafe-with-lineup";

type LineupItem = {
  id: number;
  imageFilename: string;
  reportedDate: Date;
}

export class CafeDetailDto {
  id: number;
  name: string;
  address: string;
  lineup: LineupItem[];

  static from(cafe: CafeWithLineup): CafeDetailDto {
    const dto = new CafeDetailDto();
    dto.id = cafe.id;
    dto.name = cafe.name;
    dto.address = cafe.address;
    dto.lineup = cafe.lineup.map((item: Lineup) => ({
      id: item.id,
      imageFilename: item.image_filename,
      reportedDate: item.reported_date,
    }));
    return dto;
  }
}