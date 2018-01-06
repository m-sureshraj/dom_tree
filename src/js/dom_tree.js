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
    keyNode.innerHTML = format === 'json' ? '"' + key + '"' : key;

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

    value = type === 'string' ? '"' + value + '"' : value;
    valueElement.innerHTML = entryNodeMapItem.val || value;
    valueElement.className += entryNodeMapItem.className;

    return valueElement;
}

function constructDomTree(_config, node) {
    var entryNode = null,
        data = _config.data,
        value = null;

    if (node === null) {
        node = getRootEntryNode(data);

        var wrapperNode = document.createElement('ul');
        wrapperNode.appendChild(constructChildTree(_config, node));

        return wrapperNode;
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            value = data[key];
            entryNode = createEntry(key, value, _config.format);

            if (util.isValuePrimitive(value)) {
                node.appendChild(entryNode);
            } else {
                _config.data = value;
                node.appendChild(constructChildTree(_config, entryNode));
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

function constructChildTree(_config, element) {
    var data = _config.data,
        len = util.getLengthOfObjOrArray(data);

    if (len) {
        // element contains children, so add `hc` => `hasChildren` class
        element.className = 'hc';

        // by default all parent node's are collapsed. user can fold it via config
        if (_config.fold) {
            element.className += ' fold';
        }

        // insert the toggleOptionNode into `element` as a first child
        element.insertBefore(getToggleOptionNode(), element.firstChild);

        element.appendChild(
            constructDomTree(_config, document.createElement('ul'))
        );

        // append ellipse node
        element.appendChild(getEllipseNode());

        // set item count as a data attr,
        // will be displayed to the user when folding the element
        element.setAttribute('data-cc', '// ' + len + ' Items');
    }

    element.appendChild(getCloseWrapperNode(data));

    return element;
}

function appendSeparatorNodes(ele) {
    var children = ele.children,
        i = 0,
        // no need to add separator for last children element
        len = children.length - 1;

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

function handleKeyboardNavigation(e) {
    var keyCode = e.keyCode,
        // `this` will be reference => tree
        highlightedEle = this.querySelector('.dtjs-highlight');

    if (keyCode >= 37 && keyCode <= 40) {
        e.preventDefault(); // prevent horizontal, vertical scrolling

        if (!highlightedEle) {
            // highlight tree's first child & root arrow node
            this.firstChild.className += ' dtjs-highlight dtjs-md';
            return;
        }
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

function removeHighlight() {
    var highlightedEle = this.querySelector('.dtjs-root .dtjs-highlight');

    if (highlightedEle) {
        // IE-11 does not support passing multiple arguments to
        // classList remove method
        highlightedEle.classList.remove('dtjs-highlight');
        highlightedEle.classList.remove('dtjs-md');
        highlightedEle.classList.remove('dtjs-mu');
    }
}

function isValidConfigDataType(type) {
    return type === 'object' || type === 'array' || type === 'string';
}

function validateBooleanOptions(userConfig) {
    var options = util.getBooleanOptionsFromObject(config.defaultConfig),
        i = 0,
        length = options.length,
        option;

    for (i; i < length; i++) {
        option = options[i];
        if (
            userConfig.hasOwnProperty(option) &&
            typeof userConfig[option] !== 'boolean'
        ) {
            throw new Error(
                'config.' + option + ' value should be boolean type'
            );
        }
    }
}

function validateThemeOption(userConfig) {
    if (typeof userConfig.theme !== 'string') {
        throw new Error('property `theme` should be a type string');
    }

    if (config.availableThemes.indexOf(userConfig.theme) === -1) {
        throw new Error(
            'Invalid theme option `' +
                userConfig.theme +
                '`. available options are ' +
                config.availableThemes.join(', ')
        );
    }
}

function validateFormatOption(userConfig) {
    if (typeof userConfig.format !== 'string') {
        throw new Error('property `format` should be a type string');
    }

    if (config.availableFormats.indexOf(userConfig.format) === -1) {
        throw new Error(
            'Invalid format option! available options are ' +
                config.availableFormats
        );
    }
}

function validateConfigData(_config, mode) {
    // in update mode data property is optional
    if (mode === 'update' && !_config.hasOwnProperty('data')) return;

    var type = util.getType(_config.data);

    if (!isValidConfigDataType(type)) {
        throw new Error(
            '`data` is a required property and it should be a object ' +
                'or Array or JSON but received ' +
                type
        );
    }

    // if config.data type is string then, it should be a valid json
    if (type === 'string') {
        try {
            _config.data = JSON.parse(_config.data);
        } catch (e) {
            throw new Error('property `data` should be valid JSON ' + e);
        }
    }
}

function validateConfig(userConfig, mode) {
    var _config = util.deepClone(userConfig);

    validateConfigData(_config, mode);

    // validate optional userConfig.theme option
    if (_config.hasOwnProperty('theme')) {
        validateThemeOption(_config);
    }

    // validate optional userConfig.format option
    if (_config.hasOwnProperty('format')) {
        validateFormatOption(_config);
    }

    // validate boolean options
    validateBooleanOptions(_config);

    return _config;
}

function configureTree(tree, _config) {
    tree.className = 'dtjs-root';
    tree.setAttribute('tabIndex', '0');
    tree.className += ' ' + _config.theme;

    // if data prop is empty
    if (util.isEmpty(_config.data)) {
        _config.keyboardNavigation = false;
        tree.className += ' dtjs-empty';
    }

    tree.addEventListener(
        'focus',
        function() {
            tree.classList.toggle('dtjs-root-focused');
        },
        false
    );

    tree.addEventListener(
        'blur',
        function() {
            tree.classList.toggle('dtjs-root-focused');
        },
        false
    );

    if (_config.removeHighlightOnBlur) {
        tree.addEventListener('blur', removeHighlight, false);
    }

    if (_config.keyboardNavigation) {
        tree.addEventListener('keydown', handleKeyboardNavigation, false);
    }

    // fold | collapse when clicking toggle option node
    tree.addEventListener(
        'click',
        function(e) {
            if (e.target && e.target.className === 'ex') {
                e.target.offsetParent.classList.toggle('fold');
            }
        },
        false
    );
}

function reConfigureTree(tree, previousConfig, updatedConfig) {
    // update theme class
    if (updatedConfig.theme) {
        tree.classList.replace(previousConfig.theme, updatedConfig.theme);
    }

    // handle keyboard navigation
    if (updatedConfig.hasOwnProperty('keyboardNavigation')) {
        updatedConfig.keyboardNavigation
            ? tree.addEventListener('keydown', handleKeyboardNavigation, false)
            : tree.removeEventListener(
                  'keydown',
                  handleKeyboardNavigation,
                  false
              );
    }

    // handle remove highlight on blur
    if (updatedConfig.hasOwnProperty('removeHighlightOnBlur')) {
        updatedConfig.removeHighlightOnBlur
            ? tree.addEventListener('blur', removeHighlight, false)
            : tree.removeEventListener('blur', removeHighlight, false);
    }
}

function isNewTreeRequired(keys) {
    return util.contains(config.treeGenerateSpecificOptions, keys);
}

function isReConfigurationRequired(keys) {
    return util.contains(config.treeConfigurationSpecificOptions, keys);
}

// @constructor
function DomTree(userConfig, targetNode) {
    'use strict';
    userConfig = userConfig || {};

    if (this === undefined) {
        throw new Error(
            'DomTree is a constructor function. ' +
                'Should be invoked with `new` keyword'
        );
    }

    if (!util.isValidHtmlElement(targetNode)) {
        throw new Error(targetNode + ' is not a valid HTML element');
    }

    var _config = util.mergeConfig(
        config.defaultConfig,
        validateConfig(userConfig)
    );
    var tree = constructDomTree(util.deepClone(_config), null);

    configureTree(tree, _config);

    // methods
    this.init = function() {
        // if user calling .init() more then once for target element
        if (_config.initialized || targetNode.querySelector('ul') !== null) {
            throw new Error('DomTree already initialized for target element!');
        }

        targetNode.appendChild(tree);
        _config.initialized = true;
    };

    this.update = function(updatedUserConfig) {
        updatedUserConfig = updatedUserConfig || {};

        // empty updatedUserConfig, no need to bother about update..
        if (util.getLengthOfObjOrArray(updatedUserConfig) === 0) return;

        if (!_config.initialized) {
            throw new Error(
                'Trying to update before initialize to target element!'
            );
        }

        updatedUserConfig = util.diff(
            _config,
            validateConfig(updatedUserConfig, 'update')
        );
        var keys = Object.keys(updatedUserConfig);

        // scenarios
        // * if we generate new tree again then we must need to configure it again.
        // * if only `configureTree` related prop changed then no need to regenerate
        //   the entire tree again. we can reconfigure old tree with updated prop values

        if (isNewTreeRequired(keys)) {
            _config = util.mergeConfig(_config, updatedUserConfig);
            tree = constructDomTree(util.deepClone(_config), null);
            configureTree(tree, _config);

            // replace old tree with new
            targetNode.replaceChild(tree, targetNode.querySelector('ul'));

            return;
        }

        if (isReConfigurationRequired(keys)) {
            reConfigureTree(tree, _config, updatedUserConfig);
            // update _config with updated user config values
            _config = util.mergeConfig(_config, updatedUserConfig);
        }
    };

    userConfig = null;
}

module.exports.default = DomTree;
