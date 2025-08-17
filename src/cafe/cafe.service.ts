import { Injectable, NotFoundException } from '@nestjs/common';
import { AddLineupDto } from './dto/add-lineup.dto';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PrismaService } from '../prisma.service';
import { Cafe } from 'generated/prisma/client';
import { CafeWithLatestReported, CafeWithLineup } from './types/types';
import { CreateCafeDto } from './dto/create-cafe.dto';
import { GetCafesQueryDto } from './dto/get-cafes-query.dto';
import { Page } from 'src/common/types';

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

  async getCafes(
    { hasLineup, limit, offset }: GetCafesQueryDto,
  ): Promise<Page<CafeWithLatestReported>> {
      if (hasLineup) {
          const latest = await this.prisma.lineup.groupBy({
              by: ["cafe_id"],
              _max: { reported_date: true },
              orderBy: { _max: { reported_date: "desc" } },
              take: limit,
              skip: offset,
          });

          const ids = latest.map(r => r.cafe_id);

          const cafes = await this.prisma.cafe.findMany({
              where: { id: { in: ids } },
          });

          const latestMap = new Map(latest.map(r => [r.cafe_id, r._max.reported_date]));

          return {
              items: ids.map(id => ({
                  ...cafes.find(c => c.id === id)!,
                  latest_reported_date: latestMap.get(id)!,
              })),
              nextOffset: latest.length === limit ? offset + limit : undefined,
          };
      } else {
          const rows = await this.prisma.cafe.findMany({
              skip: offset,
              take: limit,
              orderBy: { id: "desc" },
          });

          return {
              items: rows.map(c => ({
                  ...c,
                  latest_reported_date: null,
              })),
              nextOffset: rows.length === limit ? offset + limit : undefined,
          };
      }
  }

  async getCafe(id: number): Promise<Cafe> {
    const cafe: Cafe = await this.prisma.cafe.findUnique({
      where: { id },
    });
    if (!cafe) {
      throw new NotFoundException('Cafe not found');
    }
    return cafe;
  }

  async getCafeWithLineup(id: number): Promise<CafeWithLineup> {
    const cafe: CafeWithLineup = await this.prisma.cafe.findUnique({
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
