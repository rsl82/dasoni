import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { MediaDto } from '../util/dto/media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './media.entity';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types';
import { Diary } from 'src/diary/diary.entity';
import { Query } from 'typeorm/driver/Query';
import { query } from 'express';


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

  async uploadImage(
    file: Express.Multer.File,
    queryRunner: QueryRunner,
    diary?: Diary,
  ) {
    const mediaID = uuidv4();
    const ext = mime.extension(file.mimetype);
    const fileName = `${mediaID}.${ext}`;


    const uploader = new PutObjectCommand({
      Bucket: this.configService.get<string>('S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    });

    const url =
      this.configService.get<string>('S3_ENDPOINT') +
      '/' +
      this.configService.get<string>('S3_BUCKET_NAME') +
      '/' +
      fileName;

    const media = this.mediaRepository.create({
      id: mediaID,
      url,
    });

    if (diary) {
      media.diary = diary;
    }
    await queryRunner.manager.save(media);
    await this.s3.send(uploader);
    return url;
  }

  async uploadDiaryPhotos(
    files: Express.Multer.File[],
    diary: Diary,
    queryRunner: QueryRunner,
  ) {
    const photos = await Promise.all(
      files.map(async (file) => {
        return await this.uploadImage(file, queryRunner, diary);
      }),
    );

    return photos;

  }
}
