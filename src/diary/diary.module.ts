import { forwardRef, Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Diary, User])],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
