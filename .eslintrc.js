'use strict';

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['ember', '@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    env: {
        browser: true
    },
    rules: {
        'ember/no-jquery': 'error',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off'
    },
    overrides: [
        {
            files: [
                '.eslintrc.js',
                '.prettierrc.js',
                '.template-lintrc.js',
                'ember-cli-build.js',
                'index.js',
                'testem.js',
                'blueprints/*/index.js',
                'config/**/*.js',
                'tests/dummy/config/**/*.js'
            ],
            excludedFiles: ['addon/**', 'addon-test-support/**', 'app/**', 'tests/dummy/app/**'],
            parserOptions: {
                sourceType: 'script'
            },
            env: {
                browser: false,
                node: true
            },
            plugins: ['node'],
            extends: ['plugin:node/recommended']
        }
    ]
};
