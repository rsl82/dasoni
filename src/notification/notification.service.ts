import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async getNotifications(id: string) {
    const user = await this.userService.findUser(id);
    if (!user) {
      return null;
    }
    return await user.getNotifications();
  }

  async findNotification(id: string): Promise<Notification> {
    return await this.notiRepository.findOne({ where: { id } });
  }

  async readNotification(id: string) {
    return await this.notiRepository.update({ id }, { readAt: new Date() });
  }
}
