import { IsOptional } from 'class-validator';

export class socialUserDto {
  provider: string;

  @IsOptional()
  kakaoID?: string;

  name: string;

  profileImage: string;
}
