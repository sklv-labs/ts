import { Environments } from '@sklv-labs/core/enums';
import { z } from 'zod';

export const baseEnvSchema = z.object({
  npm_package_name: z.string(),
  npm_package_version: z.string(),

  NODE_ENV: z.enum(Object.values(Environments)),

  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
});

export type BaseEnvType = z.infer<typeof baseEnvSchema>;
