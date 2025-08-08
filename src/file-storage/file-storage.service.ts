import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile, rename } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileStorageService {
  private readonly uploadDir = this.config.get<string>('UPLOAD_DIR');

  constructor(private readonly config: ConfigService) {
    mkdir(this.uploadDir, { recursive: true }).catch(() => {});
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const dest = join(this.uploadDir, filename);

    try {
      if (file.buffer) {
        await writeFile(dest, file.buffer);
      } else {
        await rename((file as any).path, dest);
      }
      return filename;
    } catch {
      throw new InternalServerErrorException('파일 저장에 실패했습니다.');
    }
  }
}
