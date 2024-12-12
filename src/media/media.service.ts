import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MediaDto } from './media.dto';

@Injectable()
export class MediaService {
  private s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      endpoint: this.configService.get<string>('S3_ENDPOINT'),
      region: this.configService.get<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('S3_SECRET_KEY'),
      },
    });
  }

  async uploadImage(file: Express.Multer.File, id: string, mediaDto: MediaDto) {
    const fileName = 'x';

    const uploader = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    return await this.s3.send(uploader);
  }
}
