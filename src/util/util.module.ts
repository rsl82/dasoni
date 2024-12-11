import { Module } from '@nestjs/common';
import { socialUserDto } from './dto/social-user.dto';
import { SuccessResponseDto } from './dto/success-response.dto';

@Module({
  providers: [socialUserDto, SuccessResponseDto],
  exports: [socialUserDto, SuccessResponseDto],
})
export class UtilModule {}
