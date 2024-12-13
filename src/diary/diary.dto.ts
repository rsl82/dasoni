import { IsOptional } from 'class-validator';

export class DiaryDto {
  title: string;

  message: string;

  receiverID: string;

  @IsOptional()
  location?: string;
}
