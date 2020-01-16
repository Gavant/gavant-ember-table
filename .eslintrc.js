module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    plugins: ['ember', 'prettier'],
    extends: ['eslint:recommended', 'plugin:ember/recommended'],
    env: {
        browser: true
    },
    rules: {
        //@see http://eslint.org/docs/rules/no-var
        'no-var': 'error',
        //@see http://eslint.org/docs/rules/object-shorthand
        'object-shorthand': 'error',
        //@see http://eslint.org/docs/rules/prefer-template
        'prefer-template': 'error',
        'prettier/prettier': 'error'
    },
    overrides: [
        // node files
        {
            files: [
                'ember-cli-build.js',
                'index.js',
                'testem.js',
                'blueprints/*/index.js',
                'config/**/*.js',
                'tests/dummy/config/**/*.js',
                '.eslintrc.js'
            ],
            excludedFiles: ['addon/**', 'addon-test-support/**', 'app/**', 'tests/dummy/app/**'],
            parserOptions: {
                sourceType: 'script',
                ecmaVersion: 2015
            },
            env: {
                browser: false,
                node: true
            },
            plugins: ['node'],
            rules: Object.assign({}, require('eslint-plugin-node').configs.recommended.rules, {
                // add your custom rules and overrides for node files here

                // this can be removed once the following is fixed
                // https://github.com/mysticatea/eslint-plugin-node/issues/77
                'node/no-unpublished-require': 'off'
            })
        }
    ]
};
