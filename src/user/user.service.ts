import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { KakaoUser } from './entity/kakao.entity';
import { socialUserDto } from '../util/dto/social-user.dto';
import { NameDto } from './dto/name-update.dto';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(KakaoUser)
    private readonly kakaoRepository: Repository<KakaoUser>,
    private readonly mediaService: MediaService,
  ) {}

  //다른 소셜 로그인이 생기면 일반 레지스터와 소셜 레지스터를 나눠서 관리할 예정
  async registerKakaoUser(kakaoUser: socialUserDto): Promise<User> {
    const user = this.userRepository.create({
      name: kakaoUser.name,
      profileImage: kakaoUser.profileImage,
    });

    await this.userRepository.save(user);

    const kakaoSocial = this.kakaoRepository.create({
      kakaoID: kakaoUser.kakaoID,
      user,
    });

    await this.kakaoRepository.save(kakaoSocial);

    return user;
  }

  async findKakaoUser(kakaoID: string): Promise<User> {
    const kakaoUser = await this.kakaoRepository.findOne({
      where: { kakaoID },
      relations: ['user'],
    });

    if (!kakaoUser) {
      return null;
    }

    return kakaoUser.user;
  }

  async setRefreshToken(id: string, refreshToken: string) {
    await this.userRepository.update({ id }, { refreshToken });
  }

  async deleteRefreshToken(id: string) {
    await this.userRepository.update({ id }, { refreshToken: null });
  }

  async findUser(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findUserByName(name: string) {
    const user = await this.userRepository.findOne({ where: { name } });
    if (!user) {
      throw new NotFoundException();
    }

    return user.id;
  }

  async updateName(id: string, nameUpdateDto: NameDto) {
    try {
      await this.userRepository.update({ id }, { name: nameUpdateDto.name });
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException();
      }
      throw new InternalServerErrorException();
    }
  }

  async updateProfileImage(file: Express.Multer.File, id: string) {
    const queryRunner =
      this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const url = await this.mediaService.uploadImage(file, queryRunner);

      return await this.userRepository.update({ id }, { profileImage: url });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
