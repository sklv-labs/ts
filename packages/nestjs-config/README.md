# @sklv-labs/nestjs-config

Configuration for NestJS built on a zod schema: the environment is validated once at startup, and
injected as a typed object.

```bash
pnpm add @sklv-labs/nestjs-config
pnpm add @nestjs/common reflect-metadata
```

Requires Node.js >= 24 and NestJS 12.

## Usage

Define a schema, extend the base config service, register the module.

```ts
import { baseEnvSchema, ConfigModule, ServiceBaseConfigService } from '@sklv-labs/nestjs-config';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';

const envSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url(),
});

type Env = z.infer<typeof envSchema>;

@Injectable()
export class ConfigService extends ServiceBaseConfigService<Env> {
  database = { url: this.env.DATABASE_URL };
}

@Module({
  imports: [ConfigModule.forRoot({ validationSchema: envSchema, providers: [ConfigService] })],
})
export class AppModule {}
```

`forRoot` parses `process.env` against the schema and throws with every failing key listed if
validation fails, so a misconfigured service dies at boot rather than at first use. The module is
`@Global()`, so `ConfigService` is injectable anywhere without re-importing.

`baseEnvSchema` covers `NODE_ENV`, `PORT`, `HOST`, `npm_package_name` and `npm_package_version`.
`ServiceBaseConfigService` exposes them as `server` and `package`.

## loadEnv

`loadEnv()` reads `.env` through dotenv and applies variable expansion. Call it before Nest boots —
typically at the top of `main.ts` — since `forRoot` reads `process.env` as it already stands.

```ts
import { loadEnv } from '@sklv-labs/nestjs-config';

loadEnv({ silent: true });
```

## One caveat

`forRoot` **replaces** `process.env` with the parsed object, so zod-coerced values keep their real
types (`PORT` stays a `number`). Two consequences: `process.env` values are no longer guaranteed to
be strings, and because it is no longer Node's native environment object, variables are not
inherited by child processes. If you spawn subprocesses that need the environment, pass it
explicitly.

See [docs/SERVICE_CONFIG_PATTERN.md](docs/SERVICE_CONFIG_PATTERN.md) for a fuller worked example.

## License

MIT
