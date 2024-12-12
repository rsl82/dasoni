import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UtilModule } from 'src/util/util.module';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  imports: [UtilModule, TypeOrmModule.forFeature([Notification])],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule {}
