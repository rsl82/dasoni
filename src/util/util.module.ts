import { Module } from '@nestjs/common';
import { socialUserDto } from './dto/social-user.dto';

@Module({
  providers: [socialUserDto],
  exports: [socialUserDto],
})
export class UtilModule {}
