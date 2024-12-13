import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { NameDto } from './dto/name-update.dto';
import { Response } from 'express';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';
import { StatusCodes } from 'http-status-codes';
import { MediaDto } from 'src/util/dto/media.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
    if (code === StatusCodes.OK) {
      response = new SuccessResponseDto(true, 'Update Success');
    } else if (code === StatusCodes.CONFLICT) {
      response = new SuccessResponseDto(false, 'Name is already taken');
    } else {
      response = new SuccessResponseDto(false, 'Internal Server Error');
    }

    return res.status(code).json(response);
  }

  @Get('/search')
  async findUser(
    @Query(new ValidationPipe()) nameSearchDto: NameDto,
    @Res() res: Response,
  ) {
    const result = await this.userService.findUserByName(nameSearchDto.name);
    let response: SuccessResponseDto;
    let code: number;
    if (!result) {
      response = new SuccessResponseDto(false, 'User Not Found');
      code = StatusCodes.NOT_FOUND;
    } else {
      code = StatusCodes.OK;
      response = new SuccessResponseDto(true, 'Found User', {
        id: result,
      });
    }

    return res.status(code).json(response);
  }

  @Patch('/logout')
  async logout(@JwtToID() id: string, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    await this.userService.deleteRefreshToken(id);

    const response = new SuccessResponseDto(true, 'Logout Success');

    return res.status(StatusCodes.OK).json(response);
  }

  @Delete()
  async deleteAccount(@JwtToID() id: string, @Res() res: Response) {}

  @Patch('profile-image')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @JwtToID() id: string,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const result = await this.userService.updateProfileImage(file, id);

    console.debug(result);

    return res
      .status(StatusCodes.OK)
      .json(new SuccessResponseDto(true, 'Update Success'));
  }
}
