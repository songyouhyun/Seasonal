import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { ClsService } from "nestjs-cls";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly cls: ClsService) {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
        { level: 'error', emit: 'stdout' },]
    });
    this.$on('query', (e) => {
        const requestId = this.cls.get('requestID') || '';
        console.log(`[${requestId}] ${e.query} ${e.params} +${e.duration}ms`)
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
