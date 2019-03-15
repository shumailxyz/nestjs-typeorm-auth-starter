import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation } from '@nestjs/swagger';
import { messages } from './common/i18n/en/messages';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ title: messages.apidocs.general.helloWorld})
  getHello(): any {
    return this.appService.getHello();
  }
}
