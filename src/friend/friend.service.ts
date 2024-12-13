import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FriendRequest } from './entity/friend-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationService } from 'src/notification/notification.service';
import { Friend } from './entity/friend.entity';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly requestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly notiService: NotificationService,
  ) {}

  async sendFriendRequest(senderID: string, receiverID: string) {
    const request = this.requestRepository.create({
      sender: { id: senderID },
      receiver: { id: receiverID },
    });

    await this.requestRepository.save(request);

    console.debug(request);

    await this.notiService.createFriendNotification(
      'Friend Request',
      '',
      receiverID,
      request.id,
    );
  }

  async responseFriendRequest(requestID: string, decision: boolean) {
    if (decision) {
      await this.requestRepository.update(
        { id: requestID },
        { status: 'accepted' },
      );

      const result = await this.requestRepository.findOne({
        where: { id: requestID },
        relations: ['receiver', 'sender'],
      });

      const newFriend = this.friendRepository.create({
        user:
          result.receiver.id < result.sender.id
            ? result.receiver
            : result.sender,
        friend:
          result.receiver.id < result.sender.id
            ? result.sender
            : result.receiver,
      });

      await this.friendRepository.save(newFriend);
    } else {
      await this.requestRepository.update(
        { id: requestID },
        { status: 'rejected' },
      );
    }
  }

  async deleteFriend(userID: string, friendID: string) {
    const result = await this.friendRepository.findOne({
      where: [
        {
          user: { id: userID < friendID ? userID : friendID },
          friend: { id: userID < friendID ? friendID : userID },
        },
      ],
    });

    if (!result) {
      throw new NotFoundException();
    }

    return await this.friendRepository.remove(result);
  }
}
