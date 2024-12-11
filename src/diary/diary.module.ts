import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { User } from 'src/user/entity/user.entity';
import { UtilModule } from 'src/util/util.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UtilModule, UserModule, TypeOrmModule.forFeature([Diary, User])],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
