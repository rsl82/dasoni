import { Transform } from 'class-transformer';

export class SuccessResponseDto {
  @Transform(({ value }) => value || true)
  success: boolean; // true은 성공, false은 실패

  message: string;

  @Transform(({ value }) => value || 200)
  statusCode: number;

  data?: any;

  constructor(success: boolean, message: string, data?: any) {
    this.success = success;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}
