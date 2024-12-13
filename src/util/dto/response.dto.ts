export class ResponseDto {
  message: string;

  data?: any;

  constructor(message: string, data?: any) {
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}
