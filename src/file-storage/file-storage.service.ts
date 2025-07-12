import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // startup 시 uploads 디렉터리 생성 (recursive: 하위까지 한 번에)
    fs.mkdir(this.uploadDir, { recursive: true }).catch((err) => {
      console.error('Upload 디렉터리 생성 실패', err);
    });
  }

  /**
   * @param file Multer의 memoryStorage 혹은 diskStorage를 사용했을 때 전달되는 Express.Multer.File
   * @returns 저장된 파일의 절대 경로 혹은 상대 URL
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${file.originalname}`;
    const destPath = path.join(this.uploadDir, filename);

    try {
      if (file.buffer) {
        // memoryStorage 사용 시
        await fs.writeFile(destPath, file.buffer);
      } else if ((file as any).path) {
        // diskStorage 사용 시 (Multer가 임시로 저장한 경로에서 이동)
        await fs.rename((file as any).path, destPath);
      } else {
        throw new Error('파일 데이터를 찾을 수 없습니다.');
      }
      // 파일 절대경로 반환하거나, 서버 정적자원 설정에 맞춰 상대 URL 반환
      return destPath;
    } catch (err) {
      console.error(err);
      throw new InternalServerErrorException('파일 저장에 실패했습니다.');
    }
  }

  async deleteFile(filename: string) {
    const filePath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      console.error('파일 삭제 실패:', err);
      throw new InternalServerErrorException('파일 삭제에 실패했습니다.');
    }
  }
}
