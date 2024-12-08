import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './decorators/user-info.decorator';
import { Response } from 'express';

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
  async kakaoCallback(@UserInfo() user, @Res() res: Response) {
    await this.authService.findUserElseRegister(
      user.kakaoID,
      user.name,
      user.profileImage,
    );
    res.redirect('http://localhost:3000'); //이후 변경 필요
  }
}
