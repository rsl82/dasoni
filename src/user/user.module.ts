import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { KakaoUser } from './entity/kakao.entity';
import { UtilModule } from 'src/util/util.module';
import { Diary } from 'src/diary/diary.entity';
import { FriendRequest } from 'src/friend/entity/friend-request.entity';
import { Friend } from 'src/friend/entity/friend.entity';

@Module({
  imports: [
    UtilModule,
    TypeOrmModule.forFeature([User, KakaoUser, Diary, FriendRequest, Friend]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
