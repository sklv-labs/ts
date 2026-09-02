/** Shared commitlint config. Reference as `"@sklv-labs/dev-configs/commitlint"`. */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'perf', 'test', 'chore', 'revert', 'build', 'ci'],
    ],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
