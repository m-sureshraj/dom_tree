module.exports = {
    verbose: false,
    setupFilesAfterEnv: ['./jest.setup.js'],
    collectCoverageFrom: ['src/**/*.js', '!src/lib/navigation.js'],
    coverageDirectory: './coverage',
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
    moduleNameMapper: {
        '\\.scss$': '<rootDir>/src/styles/style_mock.js',
    },
};
