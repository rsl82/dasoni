import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './decorators/user-info.decorator';
import { Response } from 'express';
import { kakaoUserDto } from './dto/kakao-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //카카오 로그인 URL
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuth(@Req() req: Request) {
    return;
  }

  //로그인 후 callback URL
  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(
    @UserInfo() kakaoUser: kakaoUserDto,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.initializeJwtTokens(kakaoUser);
    console.log(accessToken);
    console.log(refreshToken);

    res.redirect('http://localhost:3000'); //이후 변경 필요
  }
}
