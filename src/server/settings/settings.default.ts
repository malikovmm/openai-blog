import { SetSettingDto } from './dto/set-setting.dto';

export const defaultSettings: SetSettingDto = {
  max_tokens: 4000,
  model: 'text-davinci-003',
  stop: [],
  suffix: '',
  temperature: 1,
  translateTo: '',
};
