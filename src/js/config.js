var defaultConfig = {
    ele: null,
    data: null,
    theme: null,
    format: 'object',
    fold: false,
    separators: true,
    keyboardNavigation: false,
    removeHighlightOnBlur: false
};

var availableThemes = ['one-dark', 'chrome-light', 'darcula'];

var availableFormats = ['object', 'json'];

var entryNodeMap = {
    'object': { val: '{', className: 'ob' },
    'null': { val: 'null', className: 'null' },
    'array': { val: '[', className: 'ob' },
    'undefined': { val: 'undefined', className: 'undef' },
    'number': { val: null, className: 'num' },
    'boolean': { val: null, className: 'bool' },
    'string': { val: null, className: 'str' }
};

module.exports = {
    defaultConfig: defaultConfig,
    availableThemes: availableThemes,
    entryNodeMap: entryNodeMap,
    availableFormats: availableFormats
};
