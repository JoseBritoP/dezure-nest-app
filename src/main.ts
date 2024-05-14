import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  const config = new DocumentBuilder()
  .setTitle('Nest API')
  .setDescription('Nest API Dezure')
  .setVersion('1.0')
  .addTag('Auth')
  .build()

  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('docs',app,document);
  await app.listen(3000);
}
bootstrap();
