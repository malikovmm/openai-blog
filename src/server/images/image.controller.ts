import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  private async upload(@UploadedFile() file: Express.Multer.File) {
    return { fileName: await this.imageService.saveImageLocally(file.buffer) };
  }

  @Get('search')
  private async search(@Query('q') q: string) {
    return { fileName: await this.imageService.searchImage(q) };
  }
}
