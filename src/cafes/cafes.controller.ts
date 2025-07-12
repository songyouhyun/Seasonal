import {
  Controller,
  Post,
  Param,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { CafesService } from './cafes.service';
import { AddLineupDto } from './dto/add-lineup.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cafes')
export class CafesController {
  constructor(private readonly cafesService: CafesService) {}

  @Post(':id/lineup')
  @UseInterceptors(FileInterceptor('photo'))
  addLineup(
    @Param('id') cafeId: number,
    @UploadedFile() photo: Express.Multer.File,
    @Body() dto: AddLineupDto,
  ) {
    return this.cafesService.addLineup(cafeId, photo, dto);
  }
}
