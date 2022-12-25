import { Injectable } from '@nestjs/common';
import {GoogleCloudPubSubClient} from "./google.client";

@Injectable()
export class AppService {
  getHello(): string {
    const googlePubSubClient = new GoogleCloudPubSubClient();
    googlePubSubClient
        .emit( 'pattern',"data send")
    return 'Hello World!';
  }
}
