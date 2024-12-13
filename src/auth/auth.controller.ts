import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../util/decorators/user-info.decorator';
import { Request, Response } from 'express';
import { socialUserDto } from '../util/dto/social-user.dto';
import { ResponseDto } from 'src/util/dto/response.dto';
import { StatusCodes } from 'http-status-codes';

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
    @UserInfo() kakaoUser: socialUserDto,
    @Res() res: Response,
  ) {
    const id = await this.authService.findUserElseRegister(kakaoUser);
    const { accessToken, refreshToken } =
      await this.authService.generateTokens(id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 5 * 24 * 60 * 60 * 1000,
    });

    //console debugging log

    console.debug(`accessToken: ${accessToken}`);
    console.debug(`refreshToken: ${refreshToken}`);

    return res.redirect(
      `http://localhost:3000/login/success?token=${accessToken}`,
    );
  }

  @Get('/refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    try {
      const { accessToken, refreshToken } =
        await this.authService.refreshTokens(req.cookies.refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 30 * 60 * 1000,
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      const response = new ResponseDto('Refresh Success', {
        token: accessToken,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('Unauthorized');
      return res.status(StatusCodes.UNAUTHORIZED).json(response);
    }
  }
}
