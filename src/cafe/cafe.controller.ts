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
import { CafeDetailDto } from './dto/cafe-detail.dto';
import { CafeWithLineup } from './types/cafe-with-lineup';
import { CreateCafeDto } from './dto/create-cafe.dto';

@Controller('cafes')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Post('')
  async createCafe(@Body() dto: CreateCafeDto): Promise<void> {
    return this.cafeService.createCafe(dto);
  }

  @Get('')
  async getCafes(@Query('hasLineup') hasLineup = false): Promise<CafeSummaryDto[]> {
    const cafes: Cafe[] = await this.cafeService.getCafes(hasLineup);
    return CafeSummaryDto.from(cafes);
  }

  @Get(':id')
  async getCafeDetail(@Param('id') id: number): Promise<CafeDetailDto> {
    const cafe: CafeWithLineup = await this.cafeService.getCafeWithLineup(id);
    return CafeDetailDto.from(cafe);
  }

  @Post(':id/lineup')
  @UseInterceptors(FileInterceptor('photo'))
  addLineup(
    @Param('id') cafeId: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: AddLineupDto,
  ): Promise<void> {
    return this.cafeService.addLineup(cafeId, photo, dto);
  }
}
