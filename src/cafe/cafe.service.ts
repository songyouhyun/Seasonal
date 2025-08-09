import { Injectable, NotFoundException } from '@nestjs/common';
import { AddLineupDto } from './dto/add-lineup.dto';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PrismaService } from '../prisma.service';
import { Cafe } from 'generated/prisma/client';
import { CafeWithLineup } from './types/cafe-with-lineup';
import { CreateCafeDto } from './dto/create-cafe.dto';

@Injectable()
export class CafeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createCafe(dto: CreateCafeDto): Promise<void> {
    await this.prisma.cafe.create({
      data: {
        name: dto.name,
        address: dto.address,
      },
    });
  }

  async getCafes(hasLineup?: boolean): Promise<Cafe[]> {
    return this.prisma.cafe.findMany({
      take: 1,
      where: hasLineup ? { lineup: { some: {} } } : {},
    });
  }

  async getCafe(id: number): Promise<Cafe> {
    const cafe: Cafe = await this.prisma.cafe.findUniqueOrThrow({
      where: { id },
    });
    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }
    return cafe;
  }

  async getCafeWithLineup(id: number): Promise<CafeWithLineup> {
    const cafe = await this.prisma.cafe.findUnique({
      where: { id },
      include: { lineup: true },
    });
    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }
    return cafe;
  }

  async addLineup(
    cafeId: number,
    photo: Express.Multer.File,
    dto: AddLineupDto,
  ): Promise<void> {
    await this.getCafe(cafeId);

    const fileName: string = await this.fileStorageService.uploadFile(photo);
    await this.prisma.lineup.create({
      data: {
        reported_date: dto.reportedDate,
        image_filename: fileName,
        cafe: { connect: { id: cafeId } },
      },
    });
  }
}
