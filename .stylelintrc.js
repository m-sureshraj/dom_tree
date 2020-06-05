module.exports = {
    extends: ['stylelint-config-recommended-scss'],
    ignoreFiles: ['dev/**'],
    rules: {
        // rules from stylelint pkg
        'comment-empty-line-before': null,
        indentation: 4,
        'string-quotes': 'single',

        // scss specific rules from `stylelint-scss` pkg
        'scss/comment-no-empty': true,
        'scss/double-slash-comment-whitespace-inside': 'always',
        'scss/comment-no-loud': true,
        'scss/selector-no-redundant-nesting-selector': true,
    },
};
