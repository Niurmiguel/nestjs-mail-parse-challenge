import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

import { HttpExceptionFilter } from '@common/exception';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Mail Parser')
    .setDescription('The mail parser API description')
    .setVersion('1.0')
    .addTag('mail-parser')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());
  app.use(compression());
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());



  await app.listen(3000);
}
bootstrap();
