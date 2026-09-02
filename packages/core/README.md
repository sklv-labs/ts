# @sklv-labs/core

Framework-agnostic TypeScript primitives shared across the `@sklv-labs` packages: branded UUIDs,
environment helpers and common enums.

## Installation

```bash
pnpm add @sklv-labs/core
```

Requires Node.js >= 24.

## Subpath exports

| Import                        | Contents                                 |
| ----------------------------- | ---------------------------------------- |
| `@sklv-labs/core`             | everything below, re-exported            |
| `@sklv-labs/core/enums`       | `Environments`                           |
| `@sklv-labs/core/utils`       | `Uuid`, `uuid`, `isUuid`, `asUuid`       |
| `@sklv-labs/core/environment` | app name / version / environment helpers |

## UUIDs

`Uuid<T>` is a branded string type, so a `Uuid<User>` cannot be passed where a `Uuid<Order>` is
expected. Values are UUID **v7** (time-ordered, index-friendly).

```ts
import { asUuid, isUuid, uuid, type Uuid } from '@sklv-labs/core/utils';

type UserId = Uuid<'User'>;

const id = uuid<UserId>(); // generated v7 uuid, typed as UserId

// runtime-validating type guard
if (isUuid<UserId>(req.params.id)) {
  // req.params.id is UserId here
}

// unchecked cast, for values already known to be uuids (e.g. straight from the DB)
const fromDb = asUuid<UserId>(row.id);
const maybe = asUuid<UserId>(row.parent_id); // string | null -> UserId | null
```

`isUuid` validates via `zod`; `asUuid` is a compile-time cast only and performs **no** validation.

## Environment

```ts
import {
  getAppName,
  getAppVersion,
  getEnvironment,
  getFullAppName,
  isDevelopment,
  isProduction,
  isTest,
} from '@sklv-labs/core/environment';

getAppName(); // process.env.npm_package_name, or 'unknown'
getAppVersion(); // process.env.npm_package_version, or 'unknown'
getFullAppName(); // 'my-service@1.2.3'
getEnvironment(); // Environments | undefined, from NODE_ENV
isProduction(); // NODE_ENV === 'production'
```

`getAppName` and `getAppVersion` read the `npm_package_*` variables that npm/pnpm inject when a
process is started through a package script. Outside of that they fall back to `'unknown'`.

## Enums

```ts
import { Environments } from '@sklv-labs/core/enums';

Environments.DEVELOPMENT; // 'development'
Environments.PRODUCTION; // 'production'
Environments.TEST; // 'test'
```

## Contributing

This package lives in the [sklv-labs monorepo](https://github.com/sklv-labs/ts). See the
root `README.md` for the development and release workflow.

## License

MIT
