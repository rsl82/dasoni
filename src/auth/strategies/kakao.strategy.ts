import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('KAKAO_CLIENT_ID'),
      callbackURL: configService.get<string>('KAKAO_REDIRECT_URI'),
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    try {
      const {
        _json: {
          id,
          properties: { profile_image, nickname },
        },
      } = profile;

      const user = {
        provider: 'kakao',
        kakaoID: id.toString(),
        profileImage: profile_image,
        name: nickname,
      };
      return user;
    } catch (error) {
      console.debug('Error details: ', error.stack);
      throw new UnauthorizedException();
    }
  }
}
