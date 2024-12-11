import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DiaryDto } from './diary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Repository } from 'typeorm';
import { StatusCodes } from 'http-status-codes';

@Injectable()
export class DiaryService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
  ) {}

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
}
