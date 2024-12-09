import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async registerKakaoUser(
    kakaoID: string,
    name: string,
    profileImage: string,
  ): Promise<User> {
    const user = this.userRepository.create({
      kakaoID,
      name,
      profileImage,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findKakaoUser(kakaoID: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { kakaoID },
    });
  }

  async setRefreshToken(kakaoID: string, refreshToken: string) {
    await this.userRepository.update({ kakaoID }, { refreshToken });
  }
}
