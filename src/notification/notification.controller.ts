import { Controller, Get, Param, Patch, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { NotificationService } from './notification.service';
import { StatusCodes } from 'http-status-codes';
import { ResponseDto } from 'src/util/dto/response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('notification')
export class NotificationController {
  constructor(private readonly notiSerivce: NotificationService) {}

  @Get()
  async getNotifications(@JwtToID() id: string, @Res() res: Response) {
    try {
      const result = await this.notiSerivce.getNotifications(id);
      const response = new ResponseDto('Success', { notification: result });
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('No User Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }

  @Patch(':id')
  async readNotification(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.notiSerivce.readNotification(id);
      const response = new ResponseDto('Success Update');
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      const response = new ResponseDto('Notification Not Found');
      return res.status(StatusCodes.NOT_FOUND).json(response);
    }
  }
}
