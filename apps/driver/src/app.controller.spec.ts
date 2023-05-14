import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ClientProxy, ClientsModule, ReadPacket, WritePacket} from "@nestjs/microservices";

class PubSubMockClass extends ClientProxy {
  emit  = jest.fn()

  close = jest.fn()

  connect = jest.fn()

  protected dispatchEvent = jest.fn()

  protected publish = jest.fn()
}

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ClientsModule.register([
        { name: 'CLIENT_SERVICE', customClass: PubSubMockClass },
      ])]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
