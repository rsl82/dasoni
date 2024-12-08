import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async findUserElseRegister(
    kakaoID: string,
    name: string,
    profileImage: string,
  ): Promise<User> {
    const user = await this.userService.findKakaoUser(kakaoID);

    if (!user) {
      return await this.userService.registerKakaoUser(
        kakaoID,
        name,
        profileImage,
      );
    }
    return user;
  }
}
