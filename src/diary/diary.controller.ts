import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';
import { DiaryDto } from './diary.dto';
import { AuthGuard } from '@nestjs/passport';
import { StatusCodes } from 'http-status-codes';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('diary')
@UseGuards(AuthGuard('jwt'))
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  /*
  @Get('/sent')
  async sentDiary(@JwtToID() id: string, @Res() res: Response) {
    const content = await this.diaryService.sentDiary(id);
    if (content === null) {
      const response = new SuccessResponseDto(false, 'User Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    const response = new SuccessResponseDto(true, 'Sent Diary', {
      diary: content,
    });
    return res.status(StatusCodes.OK).json(response);
  }

  @Get('/received')
  async receivedDiary(@JwtToID() id: string, @Res() res: Response) {
    const content = await this.diaryService.receivedDiary(id);
    if (content === null) {
      const response = new SuccessResponseDto(false, 'User Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }

    const response = new SuccessResponseDto(true, 'Received Diary', {
      diary: content,
    });
    return res.status(StatusCodes.OK).json(response);
  }
  */

  @Get()
  async listDiary(@JwtToID() id: string, @Res() res: Response) {
    try {
      const result = await this.diaryService.listDiary(id);
      const response = new SuccessResponseDto(true, 'Load Success', {
        diary: result,
      });
      console.debug(response);
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {}
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 4 }]))
  async postDiary(
    @JwtToID() id: string,
    @Body() diaryDto: DiaryDto,
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    const result = await this.diaryService.postDiary(id, diaryDto, files);
    if (result === StatusCodes.OK) {
      const response = new SuccessResponseDto(true, 'Post Diary');
      return res.status(StatusCodes.OK).json(response);
    }

    const response = new SuccessResponseDto(false, 'Error in posting diary');
    return res.status(result).json(response);
  }

  @Get('/search')
  async searchDiary(
    @JwtToID() id: string,
    @Query() query,
    @Res() res: Response,
  ) {
    try {
      const result = await this.diaryService.searchDiary(id, query.search);
      const response = new SuccessResponseDto(true, 'search result', {
        diary: result,
      });
      console.debug(response);
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {}
  }

  @Delete(':id')
  async deleteDiary(@Param('id') id: string, @Res() res: Response) {
    const result = await this.diaryService.deleteDiary(id);
    console.debug(result);
    if (result.affected === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'No Diary with this ID'));
    }

    return res
      .status(StatusCodes.NO_CONTENT)
      .json(new SuccessResponseDto(true, 'Deletion Success'));
  }

  @Delete()
  async deleteAllDiary(@JwtToID() id: string, @Res() res: Response) {
    const result = await this.diaryService.deleteAllDiary(id);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'Not Found'));
    }
    return res
      .status(StatusCodes.NO_CONTENT)
      .json(new SuccessResponseDto(true, 'Deletion Success'));
  }

  @Get('/photos')
  async getDiaryPhotos(@Body('id') id: string, @Res() res: Response) {
    console.debug(id);
    const result = await this.diaryService.getDiaryPhotos(id);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'Not Found'));
    }
    return res
      .status(StatusCodes.OK)
      .json(new SuccessResponseDto(true, 'Success', { photos: result }));
  }

}
