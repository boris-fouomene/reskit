import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createApp } from '@resk/nest';

async function bootstrap() {
  const app = await createApp(AppModule);
  await app.listen(3000);
}
bootstrap();
