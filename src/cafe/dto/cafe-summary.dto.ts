import { CafeWithLatestReported } from "../types/types";

export class CafeSummaryDto {
  id: number;
  name: string;
  address: string;
  latestLineupReportedDate: string | null;

  constructor(
    id: number,
    name: string,
    address: string,
    latestLineupReportedDate: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.latestLineupReportedDate = latestLineupReportedDate;
  }

  static from(cafes: CafeWithLatestReported[]): CafeSummaryDto[] {
    return cafes.map(
      (cafe) =>
        new CafeSummaryDto(
          cafe.id,
          cafe.name,
          cafe.address,
          cafe.latest_reported_date.toISOString() ?? null,
        ),
    );
  }
}
