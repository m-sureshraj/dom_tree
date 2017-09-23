import * as util from './util/util';
import * as kn from './util/keyboard_navigation';
import { defaultConfig, availableThemes, entryNodeMap } from './config';
import '../css/index.css';

function _createEntry(key, value) {
    var entryNode = document.createElement('li');

    if (key) {
        var keyElement = document.createElement('span');
        keyElement.className = 'k';
        keyElement.innerHTML = key;
        keyElement.appendChild(_getColonNode());
        entryNode.appendChild(keyElement);
    }

    entryNode.appendChild(_getValueElement(value));

    return entryNode;
}

function _getColonNode() {
    var colonNode = document.createElement('span');
    colonNode.className = 'c'; // `c` => `colon`
    colonNode.innerHTML = ': ';

    return colonNode;
}

function _getValueElement(value) {
    var type = util.getType(value);
    var entryNodeMapItem = entryNodeMap[type];
    var valueElement = document.createElement('span');
    value = (type === 'string') ? ('"' + value + '"') : value;

    valueElement.innerHTML = entryNodeMapItem.val || value;
    valueElement.className += entryNodeMapItem.className;

    return valueElement;
}

function _constructDomTree(data, root, config) {
    if (root === null) {
        root = _getRootEntryNode(data);

        var wrapperNode = document.createElement('ul');
        wrapperNode.appendChild(_constructChildTree(data, root, config));

        return wrapperNode;
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (util.isValuePrimitive(data[key])) {
                root.appendChild(_createEntry(key, data[key]));
            } else { // else part work same for obj and array
                root.appendChild(
                    _constructChildTree(data[key], _createEntry(key, data[key]), config)
                );
            }
        }
    }

    // add separator node to each direct children of root
    if (config.separators) {
        _appendSeparatorNodes(root);
    }

    return root;
}

function _getRootEntryNode(data) {
    var value = util.isArray(data) ? [] : {};

    return _createEntry(null, value);
}

function _constructChildTree(data, element, config) {
    var len = util.getLengthOfObjOrArray(data);

    if (len) {
        // element contains children, so add `hc` => `hasChildren` class
        element.className = 'hc';

        // by default all parent node's are collapsed. user can fold it via config
        if (config.fold) {
            element.className += ' fold';
        }

        // insert the toggleOptionNode into `element` as a first child
        element.insertBefore(_getToggleOptionNode(), element.firstChild);

        var parentNode = document.createElement('ul');
        element.appendChild(_constructDomTree(data, parentNode, config));

        // append ellipse node
        element.appendChild(_getEllipseNode());

        // show item count when collapsing wrapper element
        // -cc =>  children-count
        element.setAttribute('data-cc', ('// ' + len + ' Items'));
    }

    element.appendChild(_getCloseWrapperNode(data));

    return element;
}

function _appendSeparatorNodes(ele) {
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

function _getToggleOptionNode() {
    var tagToExpand = document.createElement('span');
    tagToExpand.className = 'ex'; // `ex` => `expandable`

    return tagToExpand;
}

function _getEllipseNode() {
    var ellipseNode = document.createElement('span');
    ellipseNode.className = 'dots';

    return ellipseNode;
}

function _getCloseWrapperNode(param) {
    var closeBlock = document.createElement('span');
    closeBlock.className = 'cb'; // closingBracket
    closeBlock.innerHTML = util.isArray(param) ? ']' : '}';

    return closeBlock;
}

function _handleKeyboardNavigation(tree, keyCode) {
    var highlightedEle = tree.querySelector('.dtjs-highlight');

    // if there are no highlighted element yet then highlight tree's first child
    if (!highlightedEle && (keyCode >= 37 && keyCode <= 40)) {
        tree.firstChild.className += ' dtjs-highlight';
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

function _removeHighlight(ele) {
    var highlightedEle = ele.querySelector('.dtjs-root .dtjs-highlight');
    (highlightedEle) && highlightedEle.classList.remove('dtjs-highlight', 'dtjs-md', 'dtjs-mu');
}

function _createInstancePropWithDefaultConfig(userConfig, defaultConfig, instance) {
    for (var prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            instance[prop] = (userConfig.hasOwnProperty(prop))
                ? userConfig[prop]
                : defaultConfig[prop];
        }
    }
}

function _isValidConfigData(type) {
    return (
        type === 'object' ||
        type === 'array' ||
        type === 'string'
    );
}

function _validateConfigBoolOptions(config) {
    var options = ['separators', 'fold', 'keyboardNavigation', 'removeHighlightOnBlur'],
        i = 0,
        length = options.length,
        option;

    for (i; i < length; i++) {
        option = options[i];
        if (config.hasOwnProperty(option) && typeof config[option] !== 'boolean') {
            throw new Error('config.' + option + ' value should be boolean type');
        }
    }
}

function _validateConfigThemeOption(config) {
    if (typeof config.theme !== 'string') {
        throw new Error('config.theme should be a string');
    }

    if (availableThemes.indexOf(config.theme) === -1) {
        throw new Error('Invalid theme option! available options are ' + availableThemes);
    }
}

function _validateAndPrepareConfig(config) {
    config = config || {};

    // config.ele required property, it should be a valid html element
    if (!util.isValidHtmlElement(config.ele)) {
        throw new Error(config.ele + ' is not a valid HTML element');
    }

    // config.data required property, it should be a obj | array | json
    var configDataPropType = util.getType(config.data);

    if (!_isValidConfigData(configDataPropType)) {
        throw new Error('config.data is a required property and it should be a object '
            + 'or Array or JSON but received ' + configDataPropType);
    }

    // if config.data type is string then, it should be a valid json
    if (configDataPropType === 'string') {
        try {
            config.data = JSON.parse(config.data);
        } catch (e) {
            throw new Error('config.data should be valid JSON ' + e);
        }
    }

    // if optional config.theme property present, then it should be a string type &
    // value should be a available theme option
    if (config.hasOwnProperty('theme')) {
        _validateConfigThemeOption(config);
    }

    // validate config optional boolean options
    _validateConfigBoolOptions(config);

    return config;
}

// @constructor
export default function DomTree(config) {
    config = _validateAndPrepareConfig(config);
    _createInstancePropWithDefaultConfig(config, defaultConfig, this);
}

DomTree.prototype = {
    constructor: DomTree,
    init: function() {
        // if user calling .init() more then once for instance
        if (this.ele.querySelector('ul') !== null) {
            throw new Error('DomTree already initialized for target element!');
        }

        var tree = _constructDomTree(
            this.data, null, {fold: this.fold, separators: this.separators}
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
            this.keyboardNavigation && this.removeHighlightOnBlur && _removeHighlight(tree);
        }.bind(this));

        if (this.keyboardNavigation) {
            tree.addEventListener('keydown', function(e) {
                var keyCode = e.keyCode;
                // when `.dtjs-root` is focused prevent horizontal, vertical scrolling
                if (keyCode >= 37 && keyCode <= 40) {
                    e.preventDefault();
                    _handleKeyboardNavigation(tree, keyCode);
                }
            });
        }

        // register click event listener on toggleOption node via eventDelegation
        tree.addEventListener('click', function(e) {
            if (e.target && e.target.className === 'ex') {
                util.handleToggleClass(e.target.offsetParent, 'fold');
            }
        }, false);

        // finally append constructed tree to target element :)
        this.ele.appendChild(tree);
    }
};
