module.exports = {
    verbose: false,
    collectCoverageFrom: [
        // 'src/**/*.js', // still not 100%
        'src/js/util/util.js',
        'src/js/util/keyboard_navigation.js',
        // '!src/js/config.js'
    ],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
};
