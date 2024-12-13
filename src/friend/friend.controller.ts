import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { FriendService } from './friend.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponseDto } from 'src/util/dto/success-response.dto';

@Controller('friend')
@UseGuards(AuthGuard('jwt'))
export class FriendController {
  constructor(private readonly friendService: FriendService) {}
  @Post()
  async sendFriendRequest(
    @JwtToID() senderID: string,
    @Body('receiverID') receiverID: string,
    @Res() res: Response,
  ) {
    try {
      await this.friendService.sendFriendRequest(senderID, receiverID);
      res
        .status(StatusCodes.OK)
        .json(new SuccessResponseDto(true, 'Request Sent'));
    } catch (error) {}
  }
}
