import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fs from 'fs';
import path from 'path';
import got from 'got';
import sharp from 'sharp';
import { isOk } from '../util/http';

@Injectable()
export class ImageService implements OnModuleInit {
  private readonly resourceFolder: string;
  private readonly defaultImage: string = '1.webp';

  constructor(private configService: ConfigService) {
    this.resourceFolder = path.join(process.cwd(), 'public', 'images');
  }

  public onModuleInit(): any {
    if (!fs.existsSync(this.resourceFolder)) {
      fs.mkdirSync(this.resourceFolder, { recursive: true });
    }
  }

  public async searchImage(search: string): Promise<string> {
    try {
      const res = await got
        .get('https://www.googleapis.com/customsearch/v1', {
          searchParams: {
            q: search,
            key: this.configService.get('GOOGLE_API_KEY'),
            cx: this.configService.get('GOOGLE_SEARCH_ENGINE_ID'),
            searchType: 'IMAGE',
            num: 5, // number of attempts
          },
        })
        .json();
      return await this.loadAndSaveImageLocally(res);
    } catch (e) {
      console.error('Failed to search image', e);
      return this.defaultImage;
    }
  }

  private async loadAndSaveImageLocally(googleApiData: any): Promise<string> {
    // TODO: type googleApiData
    if (!googleApiData.items) {
      throw new InternalServerErrorException('Bad google api response');
    }
    for (const item of googleApiData.items) {
      const response = await got.get(item.link, { responseType: 'buffer' });
      if (isOk(response.statusCode)) {
        return await this.saveImageLocally(response.body);
      }
    }
    return this.defaultImage;
  }

  public async saveImageLocally(file: Buffer): Promise<string> {
    const webpFile = await sharp(file).webp({ quality: 20 }).toBuffer();
    const fileName = `${fs.readdirSync(this.resourceFolder).length + 1}.webp`;
    const filePath = path.join(this.resourceFolder, fileName);
    fs.writeFileSync(filePath, webpFile);
    return fileName;
  }
}
