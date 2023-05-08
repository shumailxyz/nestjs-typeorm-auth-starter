import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { AppService } from '../../src/app.service';

module.exports = async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        AppService,
      ],
    }).compile();
  
    const appService: AppService =
      moduleFixture.get<AppService>(AppService);
    // TRUNCATE test database tables to remove any values left from previous failed runs
    await appService.truncateTables();

  
    moduleFixture.close();
  };