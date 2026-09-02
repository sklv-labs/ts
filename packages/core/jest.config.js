const baseJest = require('@sklv-labs/dev-configs/presets/base/jest.config.js');

module.exports = {
  ...baseJest,
  // The base preset also lists `<rootDir>/test`, which this package does not have.
  roots: ['<rootDir>/src'],
};
