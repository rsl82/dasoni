import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './decorators/user-info.decorator';
import { Request, Response } from 'express';
import { kakaoUserDto } from './dto/kakao-user.dto';
import { JwtToKakaoID } from './decorators/jwt-to-kakao-id.decorator';

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
    const kakaoID = await this.authService.findUserElseRegister(kakaoUser);
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(kakaoID);

    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    //console log
    console.log(`accessToken: ${accessToken}`);
    console.log(`refreshToken: ${refreshToken}`);

    return res.json({ message: 'Login Success' });
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(req.cookies.refreshToken);

      res.setHeader('Authorization', `Bearer ${accessToken}`);
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      return res.json({ message: 'Refresh Success' });
    } catch (error) {
      //res.clearCookie('refreshToken');
      throw new UnauthorizedException();
    }
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@JwtToKakaoID() kakaoID: string) {
    console.log(kakaoID);
    return 'success';

  }
}
