import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from "@nestjs/common";
import { MessagesModule } from './messages/messages.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MessagesModule);
  app.useGlobalPipes(
    new ValidationPipe()
  )
  await app.listen(3000);
}
bootstrap();
