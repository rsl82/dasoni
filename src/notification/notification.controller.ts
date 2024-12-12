import { Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';

@Controller('notification')
export class NotificationController {
  @Get()
  getNotifications(@JwtToID() id: string, @Res() res: Response) {}

  @Patch(':id')
  checkNotification(@Param('id') id: string, @Res() res: Response) {}
}
