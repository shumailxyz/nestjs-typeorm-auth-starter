import { Injectable } from '@nestjs/common';
import { messages } from './common/i18n/en/messages';

@Injectable()
export class AppService {
  getHello(): any {
    return {
      name: 'V2X Network Core',
      message: messages.apidocs.general.helloWorld,
    };
  }
}
