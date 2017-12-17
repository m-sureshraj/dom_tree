module.exports = {
    parserOptions: {
        ecmaVersion: 5
    },
    env: {
        browser: true,
        commonjs: true,
        node: true
    },
    extends: "eslint:recommended",
    // 0: off, 1: warn, 2: error
    rules: {
        // Best practices
        semi: 2,
        quotes: ["error", "single"],
        // indent: [
        //     "error",
        //     "tab"
        // ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "curly": ["error", "multi-line"],
        "dot-notation": 2,
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-else-return": 2,
        // Disallow double-negation boolean casts in a boolean context.
        "no-extra-boolean-cast": 2,
        "no-lonely-if": 2,
        "no-nested-ternary": 2,
        "no-inner-declarations": 0,
        "no-console": ["error", { allow: ["warn", "error", "info"] }],

        // variables
        "camelcase": 2,
        "no-shadow": 2,
        "no-shadow-restricted-names": 2,
        "no-unused-vars": [2, {
            "vars": "local",
            "args": "after-used"
        }]
    }
};

// https://github.com/1hella/eslint-config-airbnb-es5/blob/master/.eslintrc
