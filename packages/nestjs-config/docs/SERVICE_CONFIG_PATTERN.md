# Service config pattern

A worked end-to-end example of wiring configuration into a NestJS service. The short version is in
the [README](../README.md); this covers the whole file layout.

## 1. Schema

Extend `baseEnvSchema` rather than starting from `z.object({})` — it already declares `NODE_ENV`,
`PORT`, `HOST` and the two npm variables, so `ServiceBaseConfigService` can rely on them.

```ts
// src/config/env.schema.ts
import { baseEnvSchema } from '@sklv-labs/nestjs-config';
import { z } from 'zod';

export const envSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(5000),
});

export type Env = z.infer<typeof envSchema>;
```

Use `z.coerce` for anything numeric: environment variables arrive as strings, and the coerced value
is what ends up in the injected object.

## 2. Config service

Group related values into objects. This is the layer where raw variables become domain concepts,
so callers never touch `process.env` or an env key by name.

```ts
// src/config/config.service.ts
import { ServiceBaseConfigService } from '@sklv-labs/nestjs-config';
import { Injectable } from '@nestjs/common';

import type { Env } from './env.schema';

@Injectable()
export class ConfigService extends ServiceBaseConfigService<Env> {
  database = { url: this.env.DATABASE_URL };
  redis = { url: this.env.REDIS_URL };
  logging = { level: this.env.LOG_LEVEL };
  http = { timeoutMs: this.env.REQUEST_TIMEOUT_MS };
}
```

`server` (`port`, `host`, `env`) and `package` (`name`, `version`) come from the base class.

## 3. Registration

```ts
// src/app.module.ts
import { ConfigModule } from '@sklv-labs/nestjs-config';
import { Module } from '@nestjs/common';

import { ConfigService } from './config/config.service';
import { envSchema } from './config/env.schema';

@Module({
  imports: [ConfigModule.forRoot({ validationSchema: envSchema, providers: [ConfigService] })],
})
export class AppModule {}
```

## 4. Entry point

`loadEnv` must run before `forRoot`, which reads `process.env` as it stands at import time.

```ts
// src/main.ts
import { loadEnv } from '@sklv-labs/nestjs-config';

loadEnv();

const { NestFactory } = await import('@nestjs/core');
const { AppModule } = await import('./app.module');

const app = await NestFactory.create(AppModule);
const config = app.get(ConfigService);

await app.listen(config.server.port, config.server.host);
```

The dynamic imports matter: a static `import` of `AppModule` is hoisted above the `loadEnv()` call,
so the schema would validate an environment that has not been loaded yet.

## 5. Consuming it

```ts
@Injectable()
export class UsersService {
  constructor(private readonly config: ConfigService) {}

  connect() {
    return createPool(this.config.database.url);
  }
}
```

`ConfigModule` is `@Global()`, so no module needs to import it again.

## Failure mode

If validation fails, `forRoot` throws with every failing key, its message and the offending value:

```
Env validation error:
DATABASE_URL: Invalid url. Value: undefined
REQUEST_TIMEOUT_MS: Expected number, received nan. Value: abc
```

This happens during module construction, so the process exits at boot rather than failing on the
first request.
