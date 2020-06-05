const classNames = {
    root: 'dt-root',
    treeFocused: 'dt-root-focused',
    fold: 'dt-fold',
    empty: 'dt-empty',
    hasChildren: 'dt-hc',
    moveDown: 'dt-md',
    moveUp: 'dt-mu',
    highlight: 'dt-highlight',

    colon: 'dt-colon',
    key: 'dt-key',
    expandable: 'dt-expandable',
    dots: 'dt-dots',
    openBracket: 'dt-open-bracket',
    closeBracket: 'dt-close-bracket',
    separator: 'dt-separator',

    // primitive data types
    null: 'dt-null',
    undefined: 'dt-undef',
    number: 'dt-num',
    boolean: 'dt-bool',
    string: 'dt-str',

    // themes
    rose: 'dt-rose',
    'one-dark': 'dt-one-dark',
    'chrome-light': 'dt-chrome-light',
    darcula: 'dt-darcula',
};

const defaultTheme = 'rose';
const availableThemes = [defaultTheme, 'one-dark', 'chrome-light', 'darcula'];

const availableFormats = {
    object: 'object',
    json: 'json',
};

const defaultOptions = {
    data: null,
    theme: defaultTheme,
    format: availableFormats.object,
    fold: false,
    separators: true,
    keyboardNavigation: false,
    removeHighlightOnBlur: false,
};

const entryNodeTypes = {
    object: { val: '{', className: classNames.openBracket },
    null: { val: 'null', className: classNames.null },
    array: { val: '[', className: classNames.openBracket },
    undefined: { val: 'undefined', className: classNames.undefined },
    number: { val: null, className: classNames.number },
    boolean: { val: null, className: classNames.boolean },
    string: { val: null, className: classNames.string },
};

module.exports = {
    defaultOptions,
    availableThemes,
    entryNodeTypes,
    availableFormats,
    classNames,
};
