import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { KakaoUser } from './entity/kakao.entity';
import { socialUserDto } from './dto/social-user.dto';

@Module({
  imports: [TypeOrmModule.forFeature([User, KakaoUser])],
  controllers: [UserController],
  providers: [UserService, socialUserDto],
  exports: [UserService, socialUserDto],
})
export class UserModule {}
