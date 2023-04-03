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

@Injectable()
export class GoogleSearchService implements OnModuleInit {
  private readonly resourceFolder: string;

  constructor(private configService: ConfigService) {
    this.resourceFolder = path.join(process.cwd(), 'public', 'articleImages');
  }

  public onModuleInit(): any {
    if (!fs.existsSync(this.resourceFolder)) {
      fs.mkdirSync(this.resourceFolder, { recursive: true });
    }
  }

  public async getImage(search: string) {
    const res = await got
      .get('https://www.googleapis.com/customsearch/v1', {
        searchParams: {
          q: search,
          key: this.configService.get('GOOGLE_API_KEY'),
          cx: this.configService.get('GOOGLE_SEARCH_ENGINE_ID'),
          searchType: 'IMAGE',
          num: 5,
        },
      })
      .json();
    await this.loadAndSaveImageLocally(res);
  }

  private async loadAndSaveImageLocally(googleApiData: any) {
    // TODO: type googleApiData
    if (!googleApiData.items) {
      throw new InternalServerErrorException('Bad google api response');
    }
    for (const item of googleApiData.items) {
      const response = await got.get(item.link, { responseType: 'buffer' });
      await this.saveImageLocally(response.body);
      if (response.statusCode < 400) {
        break;
      }
    }
  }

  private async saveImageLocally(file: Buffer) {
    const webpFile = await sharp(file).webp({ quality: 20 }).toBuffer();
    const fileName = `${fs.readdirSync(this.resourceFolder).length + 1}.webp`;
    const filePath = path.join(this.resourceFolder, fileName);
    fs.writeFileSync(filePath, webpFile);
  }
}
