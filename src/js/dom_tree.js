var util = require('./util/util');
var kn = require('./util/keyboard_navigation');
var config = require('./config');
require('../css/index.css');

function createEntry(key, value, format) {
    var entryNode = document.createElement('li');

    if (key) {
        var keyElement = getKeyNode(key, format);
        keyElement.appendChild(getColonNode());
        entryNode.appendChild(keyElement);
    }

    entryNode.appendChild(getValueElement(value));

    return entryNode;
}

function getKeyNode(key, format) {
    var keyNode = document.createElement('span');
    keyNode.className = 'k';
    keyNode.innerHTML =
        format === 'json' ? ('"' + key + '"') : key;

    return keyNode;
}

function getColonNode() {
    var colonNode = document.createElement('span');
    colonNode.className = 'c'; // `c` => `colon`
    colonNode.innerHTML = ': ';

    return colonNode;
}

function getValueElement(value) {
    var type = util.getType(value);
    var entryNodeMapItem = config.entryNodeMap[type];
    var valueElement = document.createElement('span');
    value = (type === 'string') ? ('"' + value + '"') : value;

    valueElement.innerHTML = entryNodeMapItem.val || value;
    valueElement.className += entryNodeMapItem.className;

    return valueElement;
}

function constructDomTree(data, node, _config) {
    if (node === null) {
        node = getRootEntryNode(data);

        var wrapperNode = document.createElement('ul');
        wrapperNode.appendChild(constructChildTree(data, node, _config));

        return wrapperNode;
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (util.isValuePrimitive(data[key])) {
                node.appendChild(createEntry(key, data[key], _config.format));
            } else {
                node.appendChild(
                    constructChildTree(
                        data[key], createEntry(key, data[key], _config.format), _config
                    )
                );
            }
        }
    }

    // add separator node to each direct children of root
    if (_config.separators) {
        appendSeparatorNodes(node);
    }

    return node;
}

function getRootEntryNode(data) {
    var value = util.isArray(data) ? [] : {};

    return createEntry(null, value);
}

function constructChildTree(data, element, _config) {
    var len = util.getLengthOfObjOrArray(data);

    if (len) {
        // element contains children, so add `hc` => `hasChildren` class
        element.className = 'hc';

        // by default all parent node's are collapsed. user can fold it via config
        if (_config.fold) {
            element.className += ' fold';
        }

        // insert the toggleOptionNode into `element` as a first child
        element.insertBefore(getToggleOptionNode(), element.firstChild);

        element.appendChild(constructDomTree(data, document.createElement('ul'), _config));

        // append ellipse node
        element.appendChild(getEllipseNode());

        // show item count when collapsing wrapper element
        // -cc =>  children-count
        element.setAttribute('data-cc', ('// ' + len + ' Items'));
    }

    element.appendChild(getCloseWrapperNode(data));

    return element;
}

function appendSeparatorNodes(ele) {
    var children = ele.children,
        i = 0,
        // no need to add separator for last children element
        len = (children.length - 1);

    for (i; i < len; i++) {
        var separatorNode = document.createElement('span');
        separatorNode.className = 'sep';
        separatorNode.innerHTML = ',';

        children[i].appendChild(separatorNode);
    }
}

function getToggleOptionNode() {
    var tagToExpand = document.createElement('span');
    tagToExpand.className = 'ex'; // `ex` => `expandable`

    return tagToExpand;
}

function getEllipseNode() {
    var ellipseNode = document.createElement('span');
    ellipseNode.className = 'dots';

    return ellipseNode;
}

function getCloseWrapperNode(param) {
    var closeBlock = document.createElement('span');
    closeBlock.className = 'cb'; // closingBracket
    closeBlock.innerHTML = util.isArray(param) ? ']' : '}';

    return closeBlock;
}

function handleKeyboardNavigation(tree, keyCode) {
    var highlightedEle = tree.querySelector('.dtjs-highlight');

    // if there are no highlighted element yet then
    // highlight tree's first child & root arrow node
    if (!highlightedEle && (keyCode >= 37 && keyCode <= 40)) {
        tree.firstChild.className += ' dtjs-highlight dtjs-md';
        return;
    }

    switch (keyCode) {
        case 40:
            kn.moveDown(highlightedEle);
            break;
        case 38:
            kn.moveUp(highlightedEle);
            break;
        case 39:
            kn.collapse(highlightedEle);
            break;
        case 37:
            kn.fold(highlightedEle);
            break;
        default:
            return;
    }
}

function removeHighlight(ele) {
    var highlightedEle = ele.querySelector('.dtjs-root .dtjs-highlight');

    if (highlightedEle) {
        // IE-11 browser does not support passing multiple arguments to
        // classList remove method
        highlightedEle.classList.remove('dtjs-highlight');
        highlightedEle.classList.remove('dtjs-md');
        highlightedEle.classList.remove('dtjs-mu');
    }
}

function createInstancePropWithDefaultConfig(userConfig, defaultConfig, instance) {
    for (var prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            instance[prop] = (userConfig.hasOwnProperty(prop))
                ? userConfig[prop]
                : defaultConfig[prop];
        }
    }
}

function isValidConfigData(type) {
    return (
        type === 'object' ||
        type === 'array' ||
        type === 'string'
    );
}

function validateBooleanOptions(userConfig) {
    var options = util.getBooleanOptionsFromObject(config.options),
        i = 0,
        length = options.length,
        option;

    for (i; i < length; i++) {
        option = options[i];
        if (userConfig.hasOwnProperty(option) && typeof userConfig[option] !== 'boolean') {
            throw new Error('config.' + option + ' value should be boolean type');
        }
    }
}

function validateThemeOption(userConfig) {
    if (typeof userConfig.theme !== 'string') {
        throw new Error('property `theme` should be a type string');
    }

    if (config.availableThemes.indexOf(userConfig.theme) === -1) {
        throw new Error('Invalid theme option! available options are ' + config.availableThemes);
    }
}

function validateFormatOption(userConfig) {
    if (typeof userConfig.format !== 'string') {
        throw new Error('property `format` should be a type string');
    }

    if (config.availableFormats.indexOf(userConfig.format) === -1) {
        throw new Error('Invalid format option! available options are ' + config.availableFormats);
    }
}

function validateAndPrepareConfig(userConfig) {
    userConfig = userConfig || {};

    // userConfig.ele is required property, it should be a valid html element
    if (!util.isValidHtmlElement(userConfig.ele)) {
        throw new Error(userConfig.ele + ' is not a valid HTML element');
    }

    // userConfig.data is required property, it should be a obj | array | json
    var userConfigDataPropType = util.getType(userConfig.data);

    if (!isValidConfigData(userConfigDataPropType)) {
        throw new Error('`data` is a required property and it should be a object '
            + 'or Array or JSON but received ' + userConfigDataPropType);
    }

    // if userConfig.data type is string then, it should be a valid json
    if (userConfigDataPropType === 'string') {
        try {
            userConfig.data = JSON.parse(userConfig.data);
        } catch (e) {
            throw new Error('property `data` should be valid JSON ' + e);
        }
    }

    // validate optional userConfig.theme option
    if (userConfig.hasOwnProperty('theme')) {
        validateThemeOption(userConfig);
    }

    // validate optional userConfig.format option
    if (userConfig.hasOwnProperty('format')) {
        validateFormatOption(userConfig);
    }

    // validate boolean options
    validateBooleanOptions(userConfig);

    return userConfig;
}

// @constructor
function DomTree(userConfig) {
    createInstancePropWithDefaultConfig(
        validateAndPrepareConfig(userConfig),
        config.options,
        this
    );
}

DomTree.prototype = {
    constructor: DomTree,
    init: function() {
        // if user calling .init() more then once for target element
        if (this.ele.querySelector('ul') !== null) {
            throw new Error('DomTree already initialized for target element!');
        }

        var tree = constructDomTree(
            this.data,
            null,
            {
                fold: this.fold,
                separators: this.separators,
                format: this.format
            }
        );
        tree.className = 'dtjs-root';
        tree.setAttribute('tabIndex', '0');

        // add theme option class
        if (this.theme) {
            tree.className += (' ' + this.theme);
        }

        // if data prop is empty
        if (util.isEmpty(this.data)) {
            this.keyboardNavigation = false; // disable keyboard navigation
            tree.className += ' dtjs-empty';
        }

        tree.addEventListener('focus', function() {
            util.handleToggleClass(tree, 'dtjs-root-focused');
        });

        tree.addEventListener('blur', function() {
            util.handleToggleClass(tree, 'dtjs-root-focused');
            // if keyboard navigation disabled there are no highlighted element
            this.keyboardNavigation && this.removeHighlightOnBlur && removeHighlight(tree);
        }.bind(this));

        if (this.keyboardNavigation) {
            tree.addEventListener('keydown', function(e) {
                var keyCode = e.keyCode;
                // when `.dtjs-root` is focused prevent horizontal, vertical scrolling
                if (keyCode >= 37 && keyCode <= 40) {
                    e.preventDefault();
                    handleKeyboardNavigation(tree, keyCode);
                }
            });
        }

        // register click event listener on toggleOption node
        tree.addEventListener('click', function(e) {
            if (e.target && e.target.className === 'ex') {
                util.handleToggleClass(e.target.offsetParent, 'fold');
            }
        }, false);

        // finally append constructed tree to target element :)
        this.ele.appendChild(tree);
    }
};

module.exports.default = DomTree;
