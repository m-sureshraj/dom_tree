var defaultConfig = {
    data: null,
    theme: 'dtjs-default-theme',
    format: 'object',
    fold: false,
    separators: true,
    keyboardNavigation: false,
    removeHighlightOnBlur: false,
};

var treeGenerateSpecificOptions = ['fold', 'format', 'separators', 'data'];

var treeConfigurationSpecificOptions = [
    'theme',
    'keyboardNavigation',
    'removeHighlightOnBlur',
];

var availableThemes = ['dtjs-default-theme', 'one-dark', 'chrome-light', 'darcula'];

var availableFormats = ['object', 'json'];

var entryNodeMap = {
    object: { val: '{', className: 'ob' },
    null: { val: 'null', className: 'null' },
    array: { val: '[', className: 'ob' },
    undefined: { val: 'undefined', className: 'undef' },
    number: { val: null, className: 'num' },
    boolean: { val: null, className: 'bool' },
    string: { val: null, className: 'str' },
};

module.exports = {
    defaultConfig: defaultConfig,
    treeGenerateSpecificOptions: treeGenerateSpecificOptions,
    treeConfigurationSpecificOptions: treeConfigurationSpecificOptions,
    availableThemes: availableThemes,
    entryNodeMap: entryNodeMap,
    availableFormats: availableFormats,
};
