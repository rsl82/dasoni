import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { User } from 'src/user/entity/user.entity';
import { UtilModule } from 'src/util/util.module';
import { UserModule } from 'src/user/user.module';
import { Media } from 'src/media/media.entity';

import { MediaModule } from 'src/media/media.module';
import { NotificationModule } from 'src/notification/notification.module';


@Module({
  imports: [
    UtilModule,
    UserModule,
    MediaModule,
    NotificationModule,
    TypeOrmModule.forFeature([Diary, User, Media]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
