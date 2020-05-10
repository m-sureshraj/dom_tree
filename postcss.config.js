module.exports = {
    plugins: [
        // to inline @import rules content. Should be the first plugin.
        require('postcss-import'),

        // will use .stylelintrc.js file to load the configuration
        require('stylelint'),

        // to log post css messages in the console
        require('postcss-reporter')({ clearReportedMessages: true }),

        // to add vendor prefixes
        require('autoprefixer'),
    ],
};
