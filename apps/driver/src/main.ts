import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {BrokerPubSubServer} from "./broker.server";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice(  {
    strategy: new BrokerPubSubServer(),
  });

  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
