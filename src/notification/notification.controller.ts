import { Controller, Get, Param, Patch, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { NotificationService } from './notification.service';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notification')
export class NotificationController {
  constructor(private readonly notiSerivce: NotificationService) {}
  @Get()
  async getNotifications(@JwtToID() id: string, @Res() res: Response) {
    const result = await this.notiSerivce.getNotifications(id);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'No User Found'));
    }

    return res
      .status(StatusCodes.OK)
      .json(new SuccessResponseDto(true, 'Success', { notification: result }));
  }

  @Patch(':id')
  async readNotification(@Param('id') id: string, @Res() res: Response) {
    const result = await this.notiSerivce.readNotification(id);
    if (result.affected === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'Notification Not Found'));
    }

    return res
      .status(StatusCodes.OK)
      .json(new SuccessResponseDto(true, 'Success Update'));
  }
}
