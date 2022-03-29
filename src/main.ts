import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Vank')
    .setDescription('Vank API')
    .setVersion('1.0')
    .addTag('clients')
    .addTag('invoices')
    .build();

  app.enableCors();

  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  SwaggerModule.setup('swagger',  app, document);

  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(parseInt(configService.get('PORT')) || 3000);
}
bootstrap();
