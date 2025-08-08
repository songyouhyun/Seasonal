import { Module } from '@nestjs/common';
import { CafeService } from './cafe.service';
import { CafeController } from './cafe.controller';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CafeController],
  providers: [CafeService, FileStorageService, PrismaService],
})
export class CafeModule {}
