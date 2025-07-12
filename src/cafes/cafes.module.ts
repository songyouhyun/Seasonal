import { Module } from '@nestjs/common';
import { CafesService } from './cafes.service';
import { CafesController } from './cafes.controller';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CafesController],
  providers: [CafesService, FileStorageService, PrismaService],
})
export class CafesModule {}
