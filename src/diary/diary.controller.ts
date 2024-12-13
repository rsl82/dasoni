import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { DiaryService } from './diary.service';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { Response } from 'express';
import { ResponseDto } from 'src/util/dto/response.dto';
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
      const response = new ResponseDto('Load Success', {
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
    @Body(new ValidationPipe()) diaryDto: DiaryDto,
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
    @Res() res: Response,
  ) {
    try {
      await this.diaryService.postDiary(id, diaryDto, files);

      const response = new ResponseDto('Post Diary');
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        const response = new ResponseDto('Not Found');
        return res.status(StatusCodes.NOT_FOUND).json(response);
      } else {
        const response = new ResponseDto('Error while posting diary');
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
      }
    }
  }

  @Get('/search')
  async searchDiary(
    @JwtToID() id: string,
    @Query('search') search: string,
    @Res() res: Response,
  ) {
    try {
      const result = await this.diaryService.searchDiary(id, search);
      const response = new ResponseDto('Search Result', {
        diary: result,
      });
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      console.debug(error);
      const response = new ResponseDto('Error while searching diary');
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
    }
  }

  @Delete(':id')
  async deleteDiary(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.diaryService.deleteDiary(id);

      const response = new ResponseDto('Deletion Success');
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('No Diary with this ID');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }

  @Delete()
  async deleteAllDiary(@JwtToID() id: string, @Res() res: Response) {
    try {
      await this.diaryService.deleteAllDiary(id);
      const response = new ResponseDto('Deletion Success');
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }

  @Get('/photos')
  async getDiaryPhotos(@Body('id') id: string, @Res() res: Response) {
    try {
      const result = await this.diaryService.getDiaryPhotos(id);
      const response = new ResponseDto('Success', { photos: result });
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('Diary Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }
}
