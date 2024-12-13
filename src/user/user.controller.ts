import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Patch,
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
import { ResponseDto } from 'src/util/dto/response.dto';
import { StatusCodes } from 'http-status-codes';
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
    try {
      await this.userService.updateName(id, nameUpdateDto);
      const response = new ResponseDto('Update Success');

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (error instanceof ConflictException) {
        const response = new ResponseDto('Name is already taken');
        return res.status(StatusCodes.CONFLICT).json(response);
      } else {
        const response = new ResponseDto('Internal Server Error');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
      }
    }
  }

  @Get('/search')
  async findUser(
    @Query(new ValidationPipe()) nameSearchDto: NameDto,
    @Res() res: Response,
  ) {
    try {
      const result = await this.userService.findUserByName(nameSearchDto.name);

      const response = new ResponseDto('Found User', { id: result });
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('User Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }

  @Patch('/logout')
  async logout(@JwtToID() id: string, @Res() res: Response) {
    try {
      await this.userService.deleteRefreshToken(id);
      res.clearCookie('refreshToken');
      res.clearCookie('accessToken');
      const response = new ResponseDto('Logout Success');

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {}
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
    try {
      await this.userService.updateProfileImage(file, id);
      const response = new ResponseDto('Update Success');
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {}
  }
}
