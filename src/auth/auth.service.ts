import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { kakaoUserDto } from './dto/kakao-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //토큰 초기화
  async initializeJwtTokens(kakaoUser: kakaoUserDto) {
    const kakaoID = await this.findUserElseRegister(kakaoUser);
    const accessToken = this.generateAccessToken(kakaoID);
    const refreshToken = await this.generateRefreshToken(kakaoID);

    return { accessToken, refreshToken };
  }

  //access token 생성
  generateAccessToken(kakaoID: string): string {
    const payload = { kakaoID };
    return this.jwtService.sign(payload);
  }

  //refresh token 생성
  //refresh token db 저장 후 db에서 관리 예정
  async generateRefreshToken(kakaoID: string) {
    const payload = { kakaoID };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.setRefreshToken(kakaoID, hashedRefreshToken);

    return refreshToken;
  }

  //카카오 ID를 기반으로 유저를 조회하고 없을 시에는 유저 생성 후 리턴
  async findUserElseRegister(kakaoUser: kakaoUserDto): Promise<string> {
    let user = await this.userService.findKakaoUser(kakaoUser.kakaoID);

    if (!user) {
      user = await this.userService.registerKakaoUser(
        kakaoUser.kakaoID,
        kakaoUser.name,
        kakaoUser.profileImage,
      );
    }
    return user.kakaoID;
  }
}
