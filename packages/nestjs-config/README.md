# @sklv-labs/nestjs-config

A NestJS config package for quick library development.

## Features

- 🎯 **Type-Safe** - Full TypeScript support with comprehensive type definitions
- 🚀 **Easy Setup** - Simple API for both synchronous and asynchronous configuration
- 🛠️ **NestJS Native** - Built on top of NestJS with seamless integration
- 📦 **Well Configured** - Pre-configured with ESLint, Prettier, Jest, and TypeScript

## Installation

```bash
npm install @sklv-labs/nestjs-config
```

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install @nestjs/common@^11.1.11 @nestjs/core@^11.1.11
```

**Note:** This package requires Node.js 24 LTS or higher.

## Quick Start

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@sklv-labs/nestjs-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Your configuration options
    }),
  ],
})
export class AppModule {}
```

### Async Configuration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { ConfigModule } from '@sklv-labs/nestjs-config';

@Module({
  imports: [
    NestConfigModule.forRoot(),
    ConfigModule.forRootAsync({
      imports: [NestConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        // Your configuration options
      }),
    }),
  ],
})
export class AppModule {}
```

## Development

```bash
# Build
npm run build

# Lint
npm run lint

# Format
npm run format

# Test
npm run test

# Type check
npm run type-check
```

## License

MIT © [sklv-labs](https://github.com/sklv-labs)
