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
import { CafeDetailDto } from './dto/cafe-detail.dto';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { CafeWithLatestReported, CafeWithLineup } from './types/types';
import { GetCafesQueryDto } from './dto/get-cafes-query.dto';
import { Page } from 'src/common/types';

@Controller('cafes')
export class CafeController {
  constructor(private readonly cafeService: CafeService) {}

  @Post('')
  async createCafe(@Body() dto: CreateCafeDto): Promise<void> {
    return this.cafeService.createCafe(dto);
  }

  @Get('')
  async getCafes(@Query() query: GetCafesQueryDto): Promise<Page<CafeWithLatestReported>> {
    return this.cafeService.getCafes(query);
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
