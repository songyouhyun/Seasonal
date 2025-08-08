import {
  Controller,
  Post,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { CafeService } from './cafe.service';
import { AddLineupDto } from './dto/add-lineup.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CafeSummaryDto } from './dto/cafe-summary.dto';
import { Cafe } from 'generated/prisma';

@Controller('cafes')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Get('')
  async getCafes(@Query('hasLineup') hasLineup = false) {
    const cafes: Cafe[] = await this.cafeService.getCafes(hasLineup);
    return CafeSummaryDto.from(cafes);
  }

  @Post(':id/lineup')
  @UseInterceptors(FileInterceptor('photo'))
  addLineup(
    @Param('id') cafeId: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: AddLineupDto,
  ) {
    return this.cafeService.addLineup(cafeId, photo, dto);
  }
}
