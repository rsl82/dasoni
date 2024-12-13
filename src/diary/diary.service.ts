import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { DiaryDto } from './diary.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary } from './diary.entity';
import { Brackets, EntityManager, Repository, Transaction } from 'typeorm';
import { StatusCodes } from 'http-status-codes';
import { MediaService } from 'src/media/media.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class DiaryService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Diary)
    private readonly diaryRepository: Repository<Diary>,
    private readonly mediaService: MediaService,
    private readonly notiService: NotificationService,
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
      .orderBy('diary.createdAt', 'DESC')
      .getMany();
  }

  async postDiary(
    id: string,
    diaryDto: DiaryDto,
    files: { photos?: Express.Multer.File[] },
  ) {
    const sender = await this.userService.findUser(id);
    const receiver = await this.userService.findUser(diaryDto.receiverID);

    if (!sender || !receiver) {
      throw new NotFoundException('User Not Found');
    }

    const queryRunner =
      this.diaryRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const diary = this.diaryRepository.create({
        title: diaryDto.title,
        message: diaryDto.message,
        sender,
        receiver,
      });

      if (diaryDto.location) {
        diary.location = diaryDto.location;
      }

      await queryRunner.manager.save(Diary, diary);

      //사진 추가하는 메서드 작성 후 추가 예정
      if (files.photos) {
        const photos = await this.mediaService.uploadDiaryPhotos(
          files.photos,
          diary,
          queryRunner,
        );
        console.debug(photos);
      }

      await this.notiService.createNotification(
        'NEW DIARY',
        '',
        receiver.id,
        diary.id,
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return StatusCodes.OK;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
    if (!this.diaryRepository.findOne({ where: { id, isDeleted: false } })) {
      throw new NotFoundException();
    }
    const result = await this.diaryRepository.update(id, { isDeleted: true });

    if (result.affected === 0) {
      throw new NotFoundException();
    }
  }

  async deleteAllDiary(id: string) {
    const update = await this.listDiary(id);
    if (update.length === 0) {
      throw new NotFoundException();
    }
    return await this.diaryRepository
      .createQueryBuilder()
      .update(Diary)
      .set({ isDeleted: true })
      .where('id IN (:...ids)', { ids: update.map((diary) => diary.id) })
      .execute();
  }

  async getDiaryPhotos(id: string) {
    const diary = await this.diaryRepository.findOne({
      where: { id },
      relations: ['photos'],
    });
    if (!diary) {
      throw new NotFoundException();
    }
    return diary.photos;
  }
}
