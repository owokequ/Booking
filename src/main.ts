import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import { ConfigService } from '@nestjs/config';
import { ApiErrors } from './common/exception/exception-filter';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  const client = createClient({ url: config.getOrThrow<string>('REDIS_URL') });
  client.connect().catch(console.error);

  const configSwagger = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('Booking API documentation')
    .setContact('Артем', 'https://github.com/owokequ', 'owokequ@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);

  SwaggerModule.setup('/docs', app, document, {
    jsonDocumentUrl: '/swagger.json',
    yamlDocumentUrl: '/swagger.yaml',
  });

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },

      store: new RedisStore({
        client: client,
        prefix: config.getOrThrow<string>('SESSION_PREFIX'),
      }),
    }),
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ApiErrors());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
