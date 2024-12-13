import { Module } from '@nestjs/common';
import { socialUserDto } from './dto/social-user.dto';
import { SuccessResponseDto } from './dto/success-response.dto';
import { MediaDto } from './dto/media.dto';

@Module({
  providers: [socialUserDto, SuccessResponseDto, MediaDto],
  exports: [socialUserDto, SuccessResponseDto, MediaDto],
})
export class UtilModule {}
