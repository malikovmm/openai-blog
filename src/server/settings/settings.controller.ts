import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SetSettingDto } from './dto/set-setting.dto';
import { SessionAuthGuard } from '../guards/session-auth.guard';
import GetAuthorizedUser from '../decorators/get-authorizated-user.decorator';
import { User } from '../auth/entities/user.entity';
import { OpenaiService } from '../openai/openai.service';

@Controller('settings')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly openaiService: OpenaiService,
  ) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  public async save(
    @GetAuthorizedUser() user: User,
    @Body() setSettingDto: SetSettingDto,
  ) {
    return await this.settingsService.save(user.id, setSettingDto);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  public async findUserSettings(@GetAuthorizedUser() user: User) {
    return await this.settingsService.findUserSettings(user.id);
  }

  @Get('models')
  public async getModels() {
    return await this.openaiService.listModels();
  }

  @Get('default')
  public getDefault() {
    return this.settingsService.getDefaultSettings();
  }
}
