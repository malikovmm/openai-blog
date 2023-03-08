import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { ServerModule } from './server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}

bootstrap();
