import { Injectable } from '@nestjs/common';

import { BaseConfigService } from '../config';

import { BaseEnvType } from './service.base-env.schema';

/**
 * Base config service for NestJS services with common properties.
 * Extend this class in your service to add custom configuration properties.
 *
 * @example
 * ```typescript
 * export class ConfigService extends ServiceBaseConfigService<EnvType> {
 *   customProperty = this.env.CUSTOM_VAR;
 * }
 * ```
 */
@Injectable()
export class ServiceBaseConfigService<
  Env extends BaseEnvType = BaseEnvType,
> extends BaseConfigService<Env> {
  /**
   * Server configuration properties
   */
  server = {
    port: this.env.PORT,
    host: this.env.HOST,
    env: this.env.NODE_ENV,
  };

  /**
   * Package information from environment
   */
  package = {
    name: this.env.npm_package_name,
    version: this.env.npm_package_version,
  };
}
