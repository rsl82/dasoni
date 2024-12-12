import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [UtilModule],
  providers: [NotificationService],
})
export class NotificationModule {}
