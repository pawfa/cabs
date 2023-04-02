import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClientsModule} from "@nestjs/microservices";
import {GoogleCloudPubSubClient} from "./google.client";

@Module({
  imports: [ClientsModule.register([
    { name: 'CLIENT_SERVICE', customClass: GoogleCloudPubSubClient },
  ])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
