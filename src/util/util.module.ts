import { Module } from '@nestjs/common';
import { socialUserDto } from './dto/social-user.dto';
import { ResponseDto } from './dto/response.dto';
import { MediaDto } from './dto/media.dto';

@Module({
  providers: [socialUserDto, ResponseDto, MediaDto],
  exports: [socialUserDto, ResponseDto, MediaDto],
})
export class UtilModule {}
