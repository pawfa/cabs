import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {EventPattern, Payload} from "@nestjs/microservices";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('pattern')
  echo(@Payload() data: object) {
    console.log('echo', data)
    return data;
  }
}
