import { Injectable } from '@nestjs/common';
import { messages } from './common/i18n/en/messages';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: messages.appName,
      message: messages.apidocs.general.helloWorld,
    };
  }
}
