# @sklv-labs/core

Branded UUIDs, environment helpers and shared enums. No framework dependency.

```bash
pnpm add @sklv-labs/core
```

Requires Node.js >= 24.

| Import                        | Exports                            |
| ----------------------------- | ---------------------------------- |
| `@sklv-labs/core`             | everything below                   |
| `@sklv-labs/core/utils`       | `Uuid`, `uuid`, `isUuid`, `asUuid` |
| `@sklv-labs/core/environment` | app and environment helpers        |
| `@sklv-labs/core/enums`       | `Environments`                     |

## UUIDs

`Uuid<B>` is a UUID v7 string carrying a phantom brand, so a `Uuid<'User'>` will not typecheck
where a `Uuid<'Order'>` is expected. v7 is time-ordered, which makes it usable as a primary key
without the index fragmentation of v4.

```ts
import { asUuid, isUuid, uuid, type Uuid } from '@sklv-labs/core/utils';

type UserId = Uuid<'User'>;

const id = uuid<UserId>();

if (isUuid<UserId>(input)) {
  // input is UserId — validated at runtime
}

const fromDb = asUuid<UserId>(row.id); // trusted, not validated
const parent = asUuid<UserId>(row.parent_id); // string | null -> UserId | null
```

`isUuid` validates the format with zod. `asUuid` only applies the brand and performs no check —
use it for values whose format is already guaranteed, such as a database column, and `isUuid` for
anything coming from outside.

## Environment

```ts
import { getEnvironment, getFullAppName, isProduction } from '@sklv-labs/core/environment';

getFullAppName(); // 'my-service@1.2.3'
getEnvironment(); // Environments | undefined
isProduction(); // NODE_ENV === 'production'
```

`getEnvironment` returns `undefined` when `NODE_ENV` is unset **or** holds a value outside
`Environments`, so an unexpected value never masquerades as a known environment.

`getAppName` and `getAppVersion` read `npm_package_name` and `npm_package_version`, which npm and
pnpm inject only when the process is started through a package script. Outside that they return
`'unknown'`.

## License

MIT
