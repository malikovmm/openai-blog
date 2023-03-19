import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export default class ParseIntSafePipe implements PipeTransform {
  constructor(private defaultValue: number) {}

  transform(value: any): any {
    const result = parseInt(value, 10);
    if (result) return result;
    return this.defaultValue;
  }
}
