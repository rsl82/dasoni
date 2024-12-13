import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ConfigModule } from '@nestjs/config';
import { UtilModule } from 'src/util/util.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from 'src/diary/diary.entity';
import { Media } from './media.entity';

@Module({
  imports: [UtilModule, ConfigModule, TypeOrmModule.forFeature([Diary, Media])],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
