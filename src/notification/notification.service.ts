import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { NotiType } from 'src/util/enum/type.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notiRepository: Repository<Notification>,
    private readonly userService: UserService,
  ) {}

  async getNotifications(id: string) {
    const result = await this.notiRepository.find({
      where: { receiver: { id }, readAt: null },
    });

    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async findNotification(id: string): Promise<Notification> {
    return await this.notiRepository.findOne({ where: { id } });
  }

  async readNotification(id: string) {
    const result = await this.notiRepository.update(
      { id, readAt: null },
      { readAt: new Date() },
    );
    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async createFriendNotification(
    title: string,
    description: string,
    receiverID: string,
    friendRequestID: string,
  ) {
    const noti = this.notiRepository.create({
      title,
      description,
      receiver: { id: receiverID },
      type: NotiType.PROFILE,
      relatedID: friendRequestID,
    });

    await this.notiRepository.save(noti);
  }

  async createNotification(
    title: string,
    description: string,
    receiverID: string,
    relatedID: string,
    queryRunner: QueryRunner,
  ) {
    const noti = this.notiRepository.create({
      title,
      description,
      receiver: { id: receiverID },
      type: NotiType.DIARY,
      relatedID,
    });

    await queryRunner.manager.save(noti);
  }
}
