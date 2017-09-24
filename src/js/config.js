export var libConfig = {
    ele: null,
    data: null,
    separators: true,
    fold: false,
    theme: null,
    keyboardNavigation: false,
    removeHighlightOnBlur: false
};

export var availableThemes = ['one-dark', 'chrome-light', 'darcula'];

export var entryNodeMap = {
    'object': { val: '{', className: 'ob' },
    'null': { val: 'null', className: 'null' },
    'array': { val: '[', className: 'ob' },
    'undefined': { val: 'undefined', className: 'undef' },
    'number': { val: null, className: 'num' },
    'boolean': { val: null, className: 'bool' },
    'string': { val: null, className: 'str' }
};
