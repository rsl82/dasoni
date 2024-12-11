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
import { UserInfo } from '../util/decorators/user-info.decorator';
import { Request, Response } from 'express';
import { socialUserDto } from '../util/dto/social-user.dto';
import { JwtToID } from '../util/decorators/jwt-to-id.decorator';

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

    return res.status(200).send({ message: 'Login Success' });
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

      return res.status(200).send({ message: 'Refresh Success' });
    } catch (error) {
      //res.clearCookie('refreshToken');
      throw new UnauthorizedException();
    }
  }

  @Get('/test')
  @UseGuards(AuthGuard('jwt'))
  test(@JwtToID() id: string) {
    console.debug(id);
    return 'success';
  }
}
