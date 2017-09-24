module.exports = {
    plugins: [
        require('postcss-import'),
        require('stylelint'), // will use .stylelintrc.js file to load configuration
        require("postcss-reporter")({ clearReportedMessages: true }),
        require('autoprefixer'),
    ]
};
