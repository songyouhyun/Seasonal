import { Module } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CafesController } from './cafes.controller';

@Module({
  controllers: [CafesController],
  providers: [CafesService],
})
export class CafesModule {}
