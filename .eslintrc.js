module.exports = {
    parserOptions: {
        ecmaVersion: 5
    },
    env: {
        browser: true,
        commonjs: true,
        node: true,
        jest: true
    },
    extends: 'eslint:recommended',
    plugins: ['prettier'], // activating esling-plugin-prettier (--fix stuff)
    // 0: off, 1: warn, 2: error
    rules: {
        'prettier/prettier': 'error',
        // Best practices
        semi: 2,
        quotes: ['error', 'single'],
        'linebreak-style': ['error', 'unix'],
        curly: ['error', 'multi-line'],
        'dot-notation': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-else-return': 2,
        // Disallow double-negation boolean casts in a boolean context.
        'no-extra-boolean-cast': 2,
        'no-lonely-if': 2,
        'no-nested-ternary': 2,
        'no-inner-declarations': 0,
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'max-len': [2, 80, { ignoreComments: true }],
        'no-array-constructor': 2,
        'no-caller': 2,
        'no-debugger': 2,
        'no-delete-var': 2,
        'no-extra-bind': 2,
        'no-native-reassign': 2,
        'no-return-assign': 2,
        'no-self-compare': 2,
        'no-throw-literal': 2,
        'no-undef': 2,
        'no-unneeded-ternary': 2,
        'no-unreachable': 2,
        radix: 2,
        'spaced-comment': [2, 'always'],
        'valid-typeof': 2,

        // variables
        camelcase: 2,
        'no-shadow': 2,
        'no-shadow-restricted-names': 2,
        'no-unused-vars': [
            2,
            {
                vars: 'local',
                args: 'after-used'
            }
        ]
    }
};
