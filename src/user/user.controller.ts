import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtToID } from 'src/util/decorators/jwt-to-id.decorator';
import { NameUpdateDto } from './dto/name-update.dto';
import { Response } from 'express';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('/name')
  async updateName(
    @JwtToID() id: string,
    @Body(new ValidationPipe()) nameUpdateDto: NameUpdateDto,
    @Res() res: Response,
  ) {
    const response = await this.userService.updateName(id, nameUpdateDto);
    return res.status(response.statusCode).json(response);
  }
}
