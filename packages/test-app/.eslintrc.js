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
        'ember/no-classic-components': 'off',
        'ember/require-tagless-components': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'eslint/require-yield': 'off'
    },
    overrides: [
        // node files
        {
            files: [
                './.eslintrc.js',
                './.prettierrc.js',
                './.template-lintrc.js',
                './ember-cli-build.js',
                './testem.js',
                './blueprints/*/index.js',
                './config/**/*.js',
                './lib/*/index.js',
                './server/**/*.js'
            ],
            parserOptions: {
                sourceType: 'script'
            },
            env: {
                browser: false,
                node: true
            },
            plugins: ['node'],
            extends: ['plugin:node/recommended'],
            rules: {
                // this can be removed once the following is fixed
                // https://github.com/mysticatea/eslint-plugin-node/issues/77
                'node/no-unpublished-require': 'off'
            }
        },
        {
            // test files
            files: ['tests/**/*-test.{js,ts}'],
            extends: ['plugin:qunit/recommended']
        }
    ]
};
