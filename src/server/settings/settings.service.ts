import { Injectable } from '@nestjs/common';
import { SetSettingDto } from './dto/set-setting.dto';
import { SettingsRepository } from './settings.repository';
import { defaultSettings } from './settings.default';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  public async save(userId: number, createSettingDto: SetSettingDto) {
    return this.settingsRepository.saveForUser(userId, createSettingDto);
  }

  public async findUserSettings(userId) {
    const userSettings = await this.settingsRepository.findUserSettings(userId);
    if (userSettings) return userSettings;
    return await this.settingsRepository.setDefault(userId);
  }

  public getDefaultSettings() {
    return defaultSettings;
  }
}
