import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class AddLineupDto {
  @IsDate()
  @Type(() => Date)
  readonly reportedDate: Date;
}
