import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // 💡 Мягче относимся к "any" и unsafe операциям
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',

      // 🧩 Позволяем не await’ить промисы в bootstrap и тестах
      '@typescript-eslint/no-floating-promises': ['warn', { ignoreVoid: true }],

      // 🚀 Прочие улучшения
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },
  {
    // ⚙️ Отдельные правила для тестов
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
];
