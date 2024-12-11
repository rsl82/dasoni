import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { NameDto } from './dto/name-update.dto';
import { Response } from 'express';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/name')
  async updateName(
    @JwtToID() id: string,
    @Body(new ValidationPipe()) nameUpdateDto: NameDto,
    @Res() res: Response,
  ) {
    const response = await this.userService.updateName(id, nameUpdateDto);
    return res.status(response.statusCode).json(response);
  }

  @Get('/search')
  async findUser(@Query(new ValidationPipe()) nameSearchDto: NameDto) {
    const result = await this.userService.findUserByName(nameSearchDto.name);
    if (!result) {
      return new SuccessResponseDto(false, 'User Not Found', 404);
    }
    return new SuccessResponseDto(true, 'Found User', 200, {
      id: result,
    });
  }

  @Patch('/logout')
  async logout(@JwtToID() id: string, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.deleteRefreshToken(id);
  }
}
