import {MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CafeModule } from './cafe/cafe.module';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ClsModule } from 'nestjs-cls';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    CafeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOAD_DIR,
      serveRoot: '/upload',
    }),
      ClsModule.forRoot({
          global: true,
          middleware: {
              mount: true,
              setup: (cls, req) => {
                  cls.set('requestID', req.get('X-Request-ID') || uuidv4());
              },
          },
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
