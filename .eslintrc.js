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
        quotes: ['error', 'single'],
        // indent: [
        //     "error",
        //     "tab"
        // ],
        "linebreak-style": [
            "error",
            "unix"
        ],

        // variables
        "no-shadow": 2,
        "no-shadow-restricted-names": 2,
        "no-unused-vars": [2, {
            "vars": "local",
            "args": "after-used"
        }]
    }
};

// https://github.com/1hella/eslint-config-airbnb-es5/blob/master/.eslintrc
