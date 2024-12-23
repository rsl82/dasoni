import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entity/friend-request.entity';
import { User } from 'src/user/entity/user.entity';
import { UtilModule } from 'src/util/util.module';
import { NotificationModule } from 'src/notification/notification.module';
import { Friend } from './entity/friend.entity';

@Module({
  imports: [
    NotificationModule,
    UtilModule,
    TypeOrmModule.forFeature([FriendRequest, User, Friend]),
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
