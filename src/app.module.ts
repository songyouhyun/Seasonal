import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafesModule } from './cafes/cafes.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule, CafesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
