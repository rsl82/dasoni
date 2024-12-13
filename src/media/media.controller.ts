import { Controller, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /*
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @JwtToID() id: string,
    @Body() mediaDto: MediaDto,
    @Res() res: Response,
  ) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      const response = new SuccessResponseDto(
        false,
        'Only JPEG and PNG files are allowed',
      );
      return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    const result = await this.mediaService.uploadImage(file, id, mediaDto);
    const response = new SuccessResponseDto(true, 'Upload Success');

    res.status(result.$metadata.httpStatusCode).json(response);
  }
    */
}
