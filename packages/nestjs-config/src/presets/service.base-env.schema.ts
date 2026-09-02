import { Environments } from '@sklv-labs/core/enums';
import { z } from 'zod';

export const baseEnvSchema = z.object({
  // npm and pnpm inject these only when the process is started through a package script, so a
  // production `node dist/main.js` has neither. Defaulting matches getAppName() in
  // @sklv-labs/core rather than refusing to boot.
  npm_package_name: z.string().default('unknown'),
  npm_package_version: z.string().default('unknown'),

  NODE_ENV: z.enum(Object.values(Environments)),

  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
});

export type BaseEnvType = z.infer<typeof baseEnvSchema>;
