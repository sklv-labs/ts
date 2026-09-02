import { Environments } from '../enums';

const ENVIRONMENTS = new Set<string>(Object.values(Environments));

/** The npm package name of the running app, or `'unknown'` outside an npm script. */
export const getAppName = (): string => process.env.npm_package_name ?? 'unknown';

/** The npm package version of the running app, or `'unknown'` outside an npm script. */
export const getAppVersion = (): string => process.env.npm_package_version ?? 'unknown';

/** `name@version`, e.g. `my-service@1.2.3`. */
export const getFullAppName = (): string => `${getAppName()}@${getAppVersion()}`;

/**
 * The current environment, read from `NODE_ENV`. Returns `undefined` when `NODE_ENV` is
 * unset or holds a value that is not one of {@link Environments}.
 */
export const getEnvironment = (): Environments | undefined => {
  const value = process.env.NODE_ENV;
  return value !== undefined && ENVIRONMENTS.has(value) ? (value as Environments) : undefined;
};

export const isDevelopment = (): boolean => getEnvironment() === Environments.DEVELOPMENT;

export const isProduction = (): boolean => getEnvironment() === Environments.PRODUCTION;

export const isTest = (): boolean => getEnvironment() === Environments.TEST;
