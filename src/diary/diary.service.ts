import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DiaryDto } from './diary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Brackets, EntityManager, Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class DiaryService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

  /*
  async sentDiary(id: string) {
    const user = await this.userService.findUser(id);
    if (!user) {
      return null;
    }
    return await user.sentDiary;
  }

  async receivedDiary(id: string) {
    const user = await this.userService.findUser(id);
    if (!user) {
      return null;
    }
    return await user.receivedDiary;
  }
  */

  async listDiary(id: string) {
    return await this.diaryRepository
      .createQueryBuilder('diary')
      .innerJoin('diary.sender', 'sender')
      .innerJoin('diary.receiver', 'receiver')
      .select([
        'diary.id',
        'diary.title',
        'diary.message',
        'diary.createdAt',
        'diary.location',
        'sender.id',
        'sender.name',
        'receiver.id',
        'receiver.name',
      ])
      .where('(diary.sender.id = :id OR diary.receiver.id = :id)', { id })
      .andWhere('(diary.isDeleted = :isDeleted)', { isDeleted: false })
      .getMany();
  }

  async postDiary(id: string, diaryDto: DiaryDto) {
    const sender = await this.userService.findUser(id);
    const receiver = await this.userService.findUser(diaryDto.receiverID);

    if (!sender || !receiver) {
      return StatusCodes.NOT_FOUND;
    }

    const diary = this.diaryRepository.create({
      title: diaryDto.title,
      message: diaryDto.message,
      sender,
      receiver,
    });

    if (diaryDto.location) {
      diary.location = diaryDto.location;
    }

    await this.diaryRepository.save(diary);

    return StatusCodes.OK;
  }

  async searchDiary(id: string, search: string) {
    return await this.diaryRepository
      .createQueryBuilder('diary')
      .innerJoin('diary.sender', 'sender')
      .innerJoin('diary.receiver', 'receiver')
      .select([
        'diary.id',
        'diary.title',
        'diary.message',
        'diary.createdAt',
        'diary.location',
        'sender.id',
        'sender.name',
        'receiver.id',
        'receiver.name',
      ])
      .where('(diary.sender.id = :id OR diary.receiver.id = :id)', { id })
      .andWhere('(diary.title LIKE :search OR diary.message LIKE :search)', {
        search: `%${search}%`,
      })
      .andWhere('(diary.isDeleted = :isDeleted)', { isDeleted: false })
      .getMany();
  }

  async deleteDiary(id: string) {
    return await this.diaryRepository.update(id, { isDeleted: true });
  }

  async deleteAllDiary(id: string) {
    const update = await this.listDiary(id);
    if (update.length > 0) {
      return await this.diaryRepository
        .createQueryBuilder()
        .update(Diary)
        .set({ isDeleted: true })
        .where('id IN (:...ids)', { ids: update.map((diary) => diary.id) })
        .execute();
    }
  }
}
