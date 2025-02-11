import { AppModule } from './app.module';
import { createApp } from '@resk/nest';

async function bootstrap() {
  const app = await createApp(AppModule, {
    globalPrefix: "api",
    swaggerOptions: {
      enabled: true,
      path: "v1/swagger1",
    }
  });
  await app.listen(3000);
}
bootstrap();
