import { getFullAppName, isProduction } from '@sklv-labs/core/environment';
import type { DotenvConfigOptions } from 'dotenv';
import { config } from 'dotenv';
import type { DotenvExpandOptions } from 'dotenv-expand';
import { expand } from 'dotenv-expand';

export type LoadEnvOptions = Partial<{
  config: DotenvConfigOptions;
  expand: DotenvExpandOptions;
  silent?: boolean;
}>;

export const loadEnv = (
  options: LoadEnvOptions = {
    config: {
      debug: !isProduction(),
      quiet: isProduction(),
    },
    silent: false,
  },
) => {
  const result = expand({
    ...config(options.config),
    ...options.expand,
  });

  if (!options.silent) {
    // oxlint-disable-next-line no-console -- deliberate load summary, suppressed via `silent`
    console.log(
      `[${getFullAppName()}] Loaded ${Object.keys(result.parsed || {}).length} environment variables`,
    );
  }

  return result;
};
