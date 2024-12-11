import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';
import { DiaryDto } from './diary.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('diary')
@UseGuards(AuthGuard('jwt'))
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('/sent')
  async sentDiary(@JwtToID() id: string, @Res() res: Response) {
    const content = await this.diaryService.sentDiary(id);
    if (content === null) {
      const response = new SuccessResponseDto(false, 'User Not Found');
      return res.status(404).json(response);
    }

    const response = new SuccessResponseDto(true, 'Sent Diary', {
      diary: content,
    });
    return res.status(200).json(response);
  }

  @Post()
  async postDiary(
    @JwtToID() id: string,
    @Body() diaryDto: DiaryDto,
    @Res() res: Response,
  ) {
    const result = await this.diaryService.postDiary(id, diaryDto);
    if (result === 200) {
      const response = new SuccessResponseDto(true, 'Post Diary');
      return res.status(200).json(response);
    }

    const response = new SuccessResponseDto(false, 'Error in posting diary');
    return res.status(result).json(response);
  }
}