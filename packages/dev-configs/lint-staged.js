/** Shared lint-staged config. Reference as `"@sklv-labs/dev-configs/lint-staged"`. */
module.exports = {
  '*.{ts,tsx,js,mjs,cjs}': ['oxlint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
