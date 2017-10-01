var options = {
    ele: null,
    data: null,
    theme: null,
    fold: false,
    separators: true,
    keyboardNavigation: false,
    removeHighlightOnBlur: false
};

var availableThemes = ['one-dark', 'chrome-light', 'darcula'];

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
    options: options,
    availableThemes: availableThemes,
    entryNodeMap: entryNodeMap
};
