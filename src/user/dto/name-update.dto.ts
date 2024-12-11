import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
