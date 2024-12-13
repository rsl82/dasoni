import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MediaDto } from '../util/dto/media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
  private s3: S3Client;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {
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
    const uploader = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: mediaDto.fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    const url =
      this.configService.get<string>('S3_ENDPOINT') +
      '/' +
      this.configService.get<string>('S3_BUCKET_NAME') +
      '/' +
      mediaDto.fileName;

    const media = this.mediaRepository.create({
      id,
      url,
    });

    await this.mediaRepository.save(media);
    await this.s3.send(uploader);
    return url;
  }
}
