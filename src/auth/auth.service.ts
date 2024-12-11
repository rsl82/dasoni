import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { socialUserDto } from '../util/dto/social-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(id: string) {
    const accessToken = this.generateAccessToken(id);
    const refreshToken = this.generateRefreshToken(id);
    await this.hashAndSetRefreshToken(id, refreshToken);
    return { accessToken, refreshToken };
  }

  //access token 생성
  generateAccessToken(id: string): string {
    const payload = { id };
    return this.jwtService.sign(payload);
  }

  //refresh token 생성
  //refresh token db 저장 후 db에서 관리 예정
  generateRefreshToken(id: string): string {
    const payload = { id };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });
    return refreshToken;
  }

  async hashAndSetRefreshToken(
    id: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = await argon2.hash(refreshToken);

    await this.userService.setRefreshToken(id, hashedRefreshToken);
  }

  //카카오 ID를 기반으로 유저를 조회하고 없을 시에는 유저 생성 후 리턴
  async findUserElseRegister(kakaoUser: socialUserDto): Promise<string> {
    let user = await this.userService.findKakaoUser(kakaoUser.kakaoID);

    if (!user) {
      user = await this.userService.registerKakaoUser(kakaoUser);
    }
    return user.id;
  }

  //RTR 방식으로 accesstoken이 초기화될 때 refreshToken도 같이 초기화 시켜줌
  async refreshTokens(refreshToken: string) {
    try {
      const id = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }).id;
      const user = await this.userService.findUser(id);

      const matchingRefreshToken = await argon2.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!matchingRefreshToken) {
        throw new Error('Not Matching Token');
      }
      return await this.generateTokens(id);
    } catch (error) {
      console.debug('Error in refreshTokens logic.');
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
