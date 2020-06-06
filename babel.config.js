module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    ie: '11',
                },
                // ATM we don't need symbol support
                exclude: ['@babel/plugin-transform-typeof-symbol'],
            },
        ],
    ],
};
