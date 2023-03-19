import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { ServerModule } from './server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  app.use(cookieParser());
  await app.listen(process.env.NEXT_PUBLIC_PORT || 3001);
}

bootstrap();
