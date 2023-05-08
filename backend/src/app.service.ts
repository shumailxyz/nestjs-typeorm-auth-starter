import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class AppService {

  constructor(@InjectConnection() private connection: Connection) {}
  
  getHello(): string {
    return 'Hello World!';
  }

  async truncateTables() {
    // generating TRUNCATE TABLE queries for table in test database
    const tableQueries = await this.connection.query(
      `SELECT 'TRUNCATE TABLE "' || tablename || '" CASCADE;' as truncatequery FROM pg_tables WHERE schemaname = 'public'`,
    );
    // executing TRUNCATE TABLE query for each table
    for (let i = 0; i < tableQueries.length; i++) {
      await this.connection.query(tableQueries[i].truncatequery);
    }
  }
}
