import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { FriendService } from './friend.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SuccessResponseDto } from 'src/util/dto/response.dto';

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

  @Patch()
  async responseFriendRequest(
    @Body('requestID') requestID: string,
    @Body('decision') decision: boolean,
    @Res() res: Response,
  ) {
    try {
      await this.friendService.responseFriendRequest(requestID, decision);
      return res
        .status(StatusCodes.OK)
        .json(new SuccessResponseDto(true, 'Update Success'));
    } catch {}
  }

  @Delete()
  async deleteFriend(
    @JwtToID() userID: string,
    @Body('friendID') friendID: string,
    @Res() res: Response,
  ) {
    const result = await this.friendService.deleteFriend(userID, friendID);
    if (!result) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(new SuccessResponseDto(false, 'No Friend Matched'));
    }

    return res
      .status(StatusCodes.OK)
      .json(new SuccessResponseDto(true, 'Success Deletion'));
  }
}
