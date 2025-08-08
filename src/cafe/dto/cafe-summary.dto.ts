import { Cafe } from "generated/prisma";

export type lineupItem = {
  reportedDate: Date;
  imageUrl: string;
};

export class CafeSummaryDto {
  id: number;
  name: string;
  address: string;

  constructor(
    id: number,
    name: string,
    address: string,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
  }

  static from(cafes: Cafe[]): CafeSummaryDto[] {
    return cafes.map(
      (cafe) =>
        new CafeSummaryDto(
          cafe.id,
          cafe.name,
          cafe.address,
        ),
    );
  }
}
