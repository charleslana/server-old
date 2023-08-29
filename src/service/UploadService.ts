import fs from 'fs';
import mimeTypes from 'mime-types';
import path from 'path';
import pump from 'pump';
import { container } from 'tsyringe';
import { FastifyRequest } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GroupService } from './GroupService';
import { MultipartFile } from '@fastify/multipart';

export class UploadService {
  private groupService = container.resolve(GroupService);

  async send(request: FastifyRequest): Promise<string | null> {
    this.validateRequestIsMultipart(request);
    const file = await this.validateAndGetFile(request);
    this.validateImage(file);
    const fileName = await this.saveFile(file);
    await this.groupService.updateImage(
      request.session.userCharacterId!,
      fileName
    );
    return fileName;
  }

  async getFile(fileName: string): Promise<string> {
    const filePath = path.join(__dirname, '..', '..', 'uploads', fileName);
    return new Promise<string>((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
          reject(new GlobalError('Arquivo de upload não encontrado'));
        } else {
          resolve(filePath);
        }
      });
    });
  }

  private validateRequestIsMultipart(request: FastifyRequest): void {
    if (!request.isMultipart()) {
      throw new GlobalError(
        'Solicitação inválida: Multipart form-data é esperado'
      );
    }
  }

  private async validateAndGetFile(
    request: FastifyRequest
  ): Promise<MultipartFile> {
    const file = await request.file({
      limits: { fileSize: 500 * 1024 },
    });
    if (!file) {
      throw new GlobalError('Nenhum arquivo encontrado na solicitação');
    }
    return file;
  }

  private validateImage(file: MultipartFile): void {
    if (!this.isImageValid(file)) {
      throw new GlobalError(
        'Formato de arquivo inválido. Somente arquivos JPG e PNG são permitidos'
      );
    }
  }

  private isImageValid(file: MultipartFile): boolean {
    const validExtensions = ['image/jpeg', 'image/png'];
    const mimeType = file.mimetype;
    return validExtensions.includes(mimeType);
  }

  private async saveFile(file: MultipartFile): Promise<string> {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    const fileExtension = mimeTypes.extension(file.mimetype);
    const fileName = `${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);
    await new Promise<void>((resolve, reject) => {
      pump(file.file, fs.createWriteStream(filePath), err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    if (file.file.truncated) {
      fs.unlinkSync(filePath);
      throw new GlobalError(
        'Tamanho de arquivo inválido. Máximo de até 500 KB permitido'
      );
    }
    return fileName;
  }
}
