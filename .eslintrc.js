module.exports = {
    parserOptions: {
        ecmaVersion: 2018,
    },
    env: {
        browser: true,
        commonjs: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:jest/recommended', 'plugin:jest/style'],
    plugins: ['prettier', 'jest'],

    // 0: off, 1: warn, 2: error
    rules: {
        'prettier/prettier': 2,
        'no-prototype-builtins': 0,
        'no-var': 2,
        'prefer-arrow-callback': 2,
        'prefer-template': 2,
    },
};
