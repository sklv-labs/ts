---
'@sklv-labs/nestjs-config': patch
---

Stop `baseEnvSchema` from requiring `npm_package_name` and `npm_package_version`.

npm and pnpm set those variables only when a process is started through a package script, so a
service run as `node dist/main.js` — which is what a container `CMD` normally does — failed
validation and exited at boot with `Invalid input: expected string, received undefined`. Both now
default to `'unknown'`, matching `getAppName()` and `getAppVersion()` in `@sklv-labs/core`.
