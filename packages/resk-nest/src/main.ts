import { AppModule } from '@examples/app.module';
import { createApp } from './utils';
async function bootstrap() {
  const app = await createApp(AppModule);
  await app.listen(3000);
}
bootstrap();
