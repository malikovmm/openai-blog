import { Module } from '@nestjs/common';

@Module({
  providers: [GoogleSearchModule],
  exports: [GoogleSearchModule],
})
export class GoogleSearchModule {}
