import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { KakaoUser } from './entity/kakao.entity';
import { socialUserDto } from './dto/social-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(KakaoUser)
    private readonly kakaoRepository: Repository<KakaoUser>,
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

  async findUser(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
