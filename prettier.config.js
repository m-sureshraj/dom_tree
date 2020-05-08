module.exports = {
    printWidth: 90,
    trailingComma: 'es5',
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'lf',
    overrides: [
        {
            files: '*.json',
            options: {
                tabWidth: 2,
                singleQuote: false,
            },
        },
    ],
};
