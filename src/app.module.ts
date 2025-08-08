import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafeModule } from './cafe/cafe.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    CafeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOAD_DIR,
      serveRoot: '/upload',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
