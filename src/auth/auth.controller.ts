import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './decorators/user-info.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  async kakaoAuth(@Req() req: Request) {
    return;
  }

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(@UserInfo() user, @Res() res: Response) {
    console.log(user);
    this.authService.findUserElseRegister(
      user.kakaoID,
      user.name,
      user.profile_image,
    );
    res.redirect('http://localhost:3000');
  }
}
