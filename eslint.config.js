// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      // eslint ignore globs here
    ],
  },
  {
    rules: {
      // overrides
      'no-unused-vars': 'off',
      'node/prefer-global/buffer': 'off',
      'no-console': 'off',
      'ts/ban-ts-comment': 'off',
      'node/prefer-global/process': 'off',
      'import/no-mutable-exports': 'off',
      'unused-imports/no-unused-vars': 'off',
    },
  },
)
