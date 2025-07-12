import { Injectable } from '@nestjs/common';
import { AddLineupDto } from './dto/add-lineup.dto';
import { FileStorageService } from '../file-storage/file-storage.service';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CafesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly fileStorageService: FileStorageService,
  ) {}
  async addLineup(
    cafeId: number,
    photo: Express.Multer.File,
    dto: AddLineupDto,
  ): Promise<void> {
    const imageUrl: string = await this.fileStorageService.uploadFile(photo);
    await this.prisma.lineup.create({
      data: {
        reported_date: dto.reportedDate,
        image_url: imageUrl,
        cafe: { connect: { id: cafeId } },
      },
    });
  }
}
