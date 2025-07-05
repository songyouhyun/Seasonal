import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafesModule } from './cafes/cafes.module';

@Module({
  imports: [CafesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
