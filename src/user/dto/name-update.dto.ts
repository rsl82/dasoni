import { IsNotEmpty, IsString } from 'class-validator';

export class NameUpdateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
