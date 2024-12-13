import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FriendRequest } from './entity/friend-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly requestReqpository: Repository<FriendRequest>,
    private readonly notiService: NotificationService,
  ) {}

  async sendFriendRequest(senderID: string, receiverID: string) {
    const request = this.requestReqpository.create({
      sender: { id: senderID },
      receiver: { id: receiverID },
    });

    await this.requestReqpository.save(request);

    await this.notiService.createFriendNotification(
      'Friend Request',
      '',
      receiverID,
      request.id,
    );
  }
}
