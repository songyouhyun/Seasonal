import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { UpdateCafeDto } from './dto/update-cafe.dto';

@Controller('cafes')
export class CafesController {
  constructor(private readonly cafesService: CafesService) {}

  @Post()
  create(@Body() createCafeDto: CreateCafeDto) {
    return this.cafesService.create(createCafeDto);
  }

  @Get()
  findAll() {
    return this.cafesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cafesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCafeDto: UpdateCafeDto) {
    return this.cafesService.update(+id, updateCafeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cafesService.remove(+id);
  }
}
