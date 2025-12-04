import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'
import compression from 'compression';
import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'



async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: "Voluttis",
      
    })
  });


  const config = new DocumentBuilder()
  .setTitle('Voluttis API')
  .setDescription('Payment API for everyone')
  .setVersion('1.0')
  .build()

  const document = SwaggerModule.createDocument(app, config)


  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: "bluePlanet"
    }),
  )
  app.enableCors()
  app.use(helmet())
  app.use(compression())
  app.enableShutdownHooks()
  app.enableVersioning({
    type : VersioningType.URI
  })
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true
  }))
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
