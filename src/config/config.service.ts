import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';
import { Injectable, Logger } from '@nestjs/common';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig = {};
  private readonly logger: Logger = new Logger(ConfigService.name);

  constructor() {
    let config;
    try {
      config = dotenv.parse(fs.readFileSync(`${process.env.NODE_ENV}.env`));
    } catch (error) {
      this.logger.error(`No ${process.env.NODE_ENV}.env file was found.`);
    }
    if (config) {
      this.envConfig = this.validateInput(config);
    }
  }

  /**
   * Validate .env file
   * @param envConfig environment variables specified in .env file
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      DB_NAME: Joi.string().required(),
      DB_HOST: Joi.string().default('localhost'),
      DB_USERNAME: Joi.string().required(),
      DB_PASSWORD: Joi.string().required(),
      DB_PORT: Joi.number().default(5432),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.number().default(30 * 24 * 60 * 60),
      APP_PORT: Joi.number().default(8000),
      TELESERVER_PORT: Joi.number().default(8080),
      GOOGLE_APPLICATION_CREDENTIALS: Joi.string(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  /**
   * Property Getters
   */

  get appPort(): string {
    return this.envConfig.APP_PORT;
  }

  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  get jwtExpiresIn(): number {
    return Number(this.envConfig.JWT_EXPIRES_IN) || 30 * 24 * 60 * 60;
  }

  get databaseHost(): string {
    return this.envConfig.DB_HOST;
  }

  get databaseName(): string {
    return this.envConfig.DB_NAME;
  }

  get databaseUsername(): string {
    return this.envConfig.DB_USERNAME;
  }

  get databasePassword(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get databasePort(): number {
    return Number(this.envConfig.DB_PORT);
  }

}
