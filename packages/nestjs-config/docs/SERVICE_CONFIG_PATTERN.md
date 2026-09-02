# Service Config Pattern Guide

This guide explains how to properly implement environment schema and config service with base properties for services to unify them.

## Overview

The `@sklv-labs/nestjs-config` package provides a base configuration pattern that includes:

- **Base Environment Schema** (`baseEnvSchema`) - Common environment variables for all services
- **Base Config Service** (`ServiceBaseConfigService`) - Base service with common properties
- **Config Module** - Validates and provides environment variables

## Step-by-Step Implementation

### 1. Create Your Environment Schema

Extend the `baseEnvSchema` with your service-specific environment variables:

```typescript
// src/config/env.schema.ts
import { baseEnvSchema } from '@sklv-labs/nestjs-config';
import { z } from 'zod';

export const validationSchema = baseEnvSchema.extend({
  // Add your service-specific environment variables
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().optional(),

  // Example with transformation
  ENABLE_FEATURE: z
    .string()
    .transform((val) => val === 'true')
    .or(z.boolean())
    .default(false),
});

export type EnvType = z.infer<typeof validationSchema>;
```

**Base Schema Includes:**

- `npm_package_name` - Package name from package.json
- `npm_package_version` - Package version from package.json
- `NODE_ENV` - Environment (development, production, etc.)
- `PORT` - Server port (default: 3000)
- `HOST` - Server host (default: '0.0.0.0')

### 2. Create Your Config Service

Extend `ServiceBaseConfigService` with your service-specific configuration:

```typescript
// src/config/config.service.ts
import { ServiceBaseConfigService } from '@sklv-labs/nestjs-config';

import { EnvType } from './env.schema';

export class ConfigService extends ServiceBaseConfigService<EnvType> {
  // Access base properties:
  // - this.server.port
  // - this.server.host
  // - this.server.env
  // - this.package.name
  // - this.package.version

  // Add your custom configuration properties
  database = {
    url: this.env.DATABASE_URL,
  };

  auth = {
    jwtSecret: this.env.JWT_SECRET,
  };

  features = {
    enabled: this.env.ENABLE_FEATURE,
  };
}
```

**Base Properties Available:**

- `this.server.port` - Server port number
- `this.server.host` - Server host string
- `this.server.env` - Environment enum value
- `this.package.name` - Package name
- `this.package.version` - Package version

### 3. Register in Your App Module

Register the config module and your config service:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sklv-labs/nestjs-config';

import { ConfigService, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema, // Your extended schema
      providers: [ConfigService], // Your config service
    }),
    // ... other modules
  ],
  // ... other module configuration
})
export class AppModule {}
```

### 4. Use in Your Services

Inject your `ConfigService` wherever you need configuration:

```typescript
// src/users/users.service.ts
import { Injectable } from '@nestjs/common';

import { ConfigService } from '../config';

@Injectable()
export class UsersService {
  constructor(private readonly config: ConfigService) {}

  someMethod() {
    // Access base properties
    console.log(`Running on port ${this.config.server.port}`);
    console.log(`Environment: ${this.config.server.env}`);
    console.log(`Package: ${this.config.package.name}@${this.config.package.version}`);

    // Access custom properties
    const dbUrl = this.config.database.url;
    const jwtSecret = this.config.auth.jwtSecret;

    // ... your logic
  }
}
```

### 5. Use in Module Configuration

You can also use it in module configuration:

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sklv-labs/nestjs-config';
import { SomeModule } from '@some/package';

import { ConfigService, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      providers: [ConfigService],
    }),
    SomeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        databaseUrl: config.database.url,
        port: config.server.port,
        // ... other config
      }),
    }),
  ],
})
export class AppModule {}
```

## Complete Example

Here's a complete example of a service configuration:

```typescript
// src/config/env.schema.ts
import { baseEnvSchema } from '@sklv-labs/nestjs-config';
import { z } from 'zod';

export const validationSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(32),
  API_TIMEOUT: z.coerce.number().default(5000),
  ENABLE_CACHE: z
    .string()
    .transform((val) => val === 'true')
    .or(z.boolean())
    .default(false),
});

export type EnvType = z.infer<typeof validationSchema>;

// src/config/config.service.ts
import { ServiceBaseConfigService } from '@sklv-labs/nestjs-config';

import { EnvType } from './env.schema';

export class ConfigService extends ServiceBaseConfigService<EnvType> {
  database = {
    url: this.env.DATABASE_URL,
  };

  redis = {
    url: this.env.REDIS_URL,
  };

  auth = {
    jwtSecret: this.env.JWT_SECRET,
  };

  api = {
    timeout: this.env.API_TIMEOUT,
  };

  cache = {
    enabled: this.env.ENABLE_CACHE,
  };
}

// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sklv-labs/nestjs-config';

import { ConfigService, validationSchema } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      providers: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Benefits

1. **Type Safety** - Full TypeScript support with inferred types
2. **Validation** - Environment variables are validated at startup
3. **Unified Base** - All services share common base properties
4. **Extensibility** - Easy to extend with service-specific properties
5. **Consistency** - Same pattern across all services

## Best Practices

1. **Always extend `baseEnvSchema`** - Don't create schemas from scratch
2. **Group related properties** - Organize config properties logically (e.g., `database`, `auth`, `api`)
3. **Use transformations** - Convert string env vars to appropriate types (booleans, numbers, etc.)
4. **Provide defaults** - Use `.default()` for optional configuration
5. **Document your schema** - Add comments explaining what each variable does

## Troubleshooting

### Type Error: "ServiceBaseConfigService is not generic"

Make sure you're using the latest version of `@sklv-labs/nestjs-config`. The base service is generic and accepts your extended `EnvType`.

### Environment Validation Errors

If you see validation errors at startup, check:

1. All required environment variables are set
2. Variable types match the schema (e.g., numbers, URLs, enums)
3. Default values are provided for optional variables

### Accessing Base Properties

Remember that base properties are available through:

- `this.config.server.*` - Server configuration
- `this.config.package.*` - Package information
