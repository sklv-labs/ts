import { Environments } from '../enums';

/**
 * Get the name of the application from the npm package name
 * @returns The name of the application or 'unknown' if not found
 */
export const getAppName = () => {
  return process.env.npm_package_name || 'unknown';
};

/**
 * Get the version of the application from the npm package version
 * @returns The version of the application or 'unknown' if not found
 */
export const getAppVersion = () => {
  return process.env.npm_package_version || 'unknown';
};

/**
 * Get the full name of the application including the name and version
 * @returns The full name of the application or 'unknown@unknown' if not found
 */
export const getFullAppName = () => {
  return `${getAppName()}@${getAppVersion()}`;
};

/**
 * Get the environment from the NODE_ENV environment variable
 * @returns The environment or undefined if not found
 */
export const getEnvironment = () => {
  return process.env.NODE_ENV as Environments | undefined;
};

/**
 * Check if the environment is development
 * @returns True if the environment is development, false otherwise
 */
export const isDevelopment = () => {
  return getEnvironment() === Environments.DEVELOPMENT;
};

/**
 * Check if the environment is production
 * @returns True if the environment is production, false otherwise
 */
export const isProduction = () => {
  return getEnvironment() === Environments.PRODUCTION;
};

/**
 * Check if the environment is test
 * @returns True if the environment is test, false otherwise
 */
export const isTest = () => {
  return getEnvironment() === Environments.TEST;
};
