import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UtilModule } from 'src/util/util.module';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UtilModule,
    UserModule,
    TypeOrmModule.forFeature([Notification, User]),
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
