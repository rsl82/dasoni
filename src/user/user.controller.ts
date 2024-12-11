import {
  Body,
  Controller,
  Delete,
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
    const code = await this.userService.updateName(id, nameUpdateDto);

    let response: SuccessResponseDto;
    if (code === 200) {
      response = new SuccessResponseDto(true, 'Update Success', 200);
    } else if (code === 409) {
      response = new SuccessResponseDto(false, 'Name is already taken', 409);
    } else {
      response = new SuccessResponseDto(false, 'Internal Server Error', 500);
    }

    return res.status(response.statusCode).json(response);
  }

  @Get('/search')
  async findUser(
    @Query(new ValidationPipe()) nameSearchDto: NameDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.findUserByName(nameSearchDto.name);
    let response: SuccessResponseDto;
    if (!result) {
      response = new SuccessResponseDto(false, 'User Not Found', 404);
    } else {
      response = new SuccessResponseDto(true, 'Found User', 200, {
        id: result,
      });
    }

    return res.status(response.statusCode).json(response);
  }

  @Patch('/logout')
  async logout(@JwtToID() id: string, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.deleteRefreshToken(id);

    const response = new SuccessResponseDto(true, 'Logout Success', 200);

    return res.status(response.statusCode).json(response);
  }

  @Delete()
  async deleteAccount(@JwtToID() id: string, @Res() res: Response) {}
}
