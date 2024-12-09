import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async generateTokens(kakaoID: string) {
    const accessToken = this.generateAccessToken(kakaoID);
    const refreshToken = this.generateRefreshToken(kakaoID);
    await this.hashAndSetRefreshToken(kakaoID, refreshToken);
    return { accessToken, refreshToken };
  }

  //access token 생성
  generateAccessToken(kakaoID: string): string {
    const payload = { kakaoID };
    return this.jwtService.sign(payload);
  }

  //refresh token 생성
  //refresh token db 저장 후 db에서 관리 예정
  generateRefreshToken(kakaoID: string): string {
    const payload = { kakaoID };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    return refreshToken;
  }

  async hashAndSetRefreshToken(
    kakaoID: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.setRefreshToken(kakaoID, hashedRefreshToken);
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

  //RTR 방식으로 accesstoken이 초기화될 때 refreshToken도 같이 초기화 시켜줌
  async refreshTokens(refreshToken: string) {
    try {
      const kakaoID = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }).kakaoID;
      const user = await this.userService.findKakaoUser(kakaoID);

      const matchingRefreshToken = await argon2.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!matchingRefreshToken) {
        throw new Error('Not Matching Token');
      }
      return await this.generateTokens(kakaoID);
    } catch (error) {
      console.debug('Error in refreshTokens logic.');
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
