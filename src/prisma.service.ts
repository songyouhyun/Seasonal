import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },]
    });
<<<<<<< HEAD
    this.$on('query', (e) => console.log(`[prisma] ${e.query} ${e.params} +${e.duration}ms`));
=======
    this.$on('query', (e) => console.log(`[prisma] ${e.query} +${e.duration}ms`));
>>>>>>> b0f00b7 (Prisma 쿼리 로깅)
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
