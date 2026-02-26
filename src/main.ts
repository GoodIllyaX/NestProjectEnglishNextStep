import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { CustomExceptionFilter } from './exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from './validation.pipe';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt'

import axios from 'axios'; // REMOVE ON PROD!!!

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  // Exception filter
  app.useGlobalFilters(new CustomExceptionFilter());

  // Connect pipe
  app.useGlobalPipes(new ValidationPipe());

  // Role guard
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new AuthGuard(jwtService), new RolesGuard(reflector));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('API Documentation') 
    .setDescription('This is the API documentation for the application') 
    .setVersion('2.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('api', app, document); 
  // Swagger end

  // HEARTHBEAT PING (DELETE ON PROD!!!)
  setInterval(async () => {
    try {
      await axios.get('https://eng.server24.uno');
      console.log('Ping successful');
    } catch (error) {
      console.error('Ping failed:', error.message);
    }
  }, 10 * 60 * 1000);
  /////////////////////////////////

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
