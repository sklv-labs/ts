import { getFullAppName, isProduction } from '@sklv-labs/core/environment';
import { config, DotenvConfigOptions } from 'dotenv';
import { expand, DotenvExpandOptions } from 'dotenv-expand';

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
  }
) => {
  const result = expand({
    ...config(options.config),
    ...options.expand,
  });

  if (!options.silent) {
    // eslint-disable-next-line no-console
    console.log(
      `[${getFullAppName()}] Loaded ${Object.keys(result.parsed || {}).length} environment variables`
    );
  }

  return result;
};
