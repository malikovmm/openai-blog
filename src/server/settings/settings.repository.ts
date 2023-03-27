import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Settings } from './entities/setting.entity';
import { defaultSettings } from './settings.default';
import { SetSettingDto } from './dto/set-setting.dto';

@Injectable()
export class SettingsRepository extends Repository<Settings> {
  constructor(private readonly dataSource: DataSource) {
    super(Settings, dataSource.createEntityManager());
  }

  public async findUserSettings(userId: number) {
    return this.findOneBy({ user: { id: userId } });
  }

  public async setDefault(userId: number) {
    return this.save({
      ...defaultSettings,
      user: { id: userId },
    });
  }

  public async saveForUser(userId: number, settings: SetSettingDto) {
    const userSettings = await this.findOneBy({ user: { id: userId } });
    if (userSettings)
      return this.save({
        ...settings,
        id: userSettings.id,
        user: { id: userId },
      }); // settings already exists
    return this.save({ ...settings, user: { id: userId } }); // create new settings
  }
}
