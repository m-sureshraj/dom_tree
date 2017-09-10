(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DomTree"] = factory();
	else
		root["DomTree"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["default"] = DomTree;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_util__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_keyboard_navigation__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_index_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__css_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__css_index_css__);





function _createEntry(key, value) {
    var entryNode = document.createElement('li');

    if (key) {
        var keyElement = document.createElement('span');
        keyElement.className = 'k';
        keyElement.innerHTML = key + ': ';
        entryNode.appendChild(keyElement);
    }

    entryNode.appendChild(_getValueElement(value));

    return entryNode;
}

function _getValueElement(value) {
    var type = __WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* getType */](value);
    var entryNodeMapItem = __WEBPACK_IMPORTED_MODULE_2__config__["c" /* entryNodeMap */][type];
    var valueElement = document.createElement('span');
    value = (type === 'string') ? ('"' + value + '"') : value;

    valueElement.innerHTML = entryNodeMapItem.val || value;
    valueElement.className += entryNodeMapItem.className;

    return valueElement;
}

function _constructDomTree(data, root) {
    if (root === null) {
        root = _getRootEntryNode(data);

        var wrapperNode = document.createElement('ul');
        wrapperNode.appendChild(_constructChildTree(data, root));

        return wrapperNode;
    }

    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            if (__WEBPACK_IMPORTED_MODULE_0__util_util__["g" /* isValuePrimitive */](data[key])) {
                root.appendChild(_createEntry(key, data[key]));
            } else { // else part work same for obj and array
                var val = data[key];
                var entry = _createEntry(key, val);

                root.appendChild(_constructChildTree(val, entry));
            }
        }
    }

    // add separator node to each direct children of root
    if (__WEBPACK_IMPORTED_MODULE_2__config__["b" /* defaultConfig */].separators) {
        _appendSeparatorNodes(root);
    }

    return root;
}

function _getRootEntryNode(data) {
    var value = __WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* isArray */](data) ? [] : {};

    return _createEntry(null, value);
}

function _constructChildTree(data, element) {
    var len = __WEBPACK_IMPORTED_MODULE_0__util_util__["a" /* getLengthOfObjOrArray */](data);

    if (len) {
        // element contains children, so add `hc` => `hasChildren` class
        element.className = 'hc';

        // by default all parent node's are collapsed. user can fold it via config
        if (__WEBPACK_IMPORTED_MODULE_2__config__["b" /* defaultConfig */].fold) {
            element.className += ' fold';
        }

        // insert the toggleOptionNode into `element` as a first child
        element.insertBefore(_getToggleOptionNode(), element.firstChild);

        var parentNode = document.createElement('ul');
        element.appendChild(_constructDomTree(data, parentNode));

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
    closeBlock.innerHTML = __WEBPACK_IMPORTED_MODULE_0__util_util__["d" /* isArray */](param) ? ']' : '}';

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
            __WEBPACK_IMPORTED_MODULE_1__util_keyboard_navigation__["c" /* moveDown */](highlightedEle);
            break;
        case 38:
            __WEBPACK_IMPORTED_MODULE_1__util_keyboard_navigation__["d" /* moveUp */](highlightedEle);
            break;
        case 39:
            __WEBPACK_IMPORTED_MODULE_1__util_keyboard_navigation__["a" /* collapse */](highlightedEle);
            break;
        case 37:
            __WEBPACK_IMPORTED_MODULE_1__util_keyboard_navigation__["b" /* fold */](highlightedEle);
            break;
        default:
            return;
    }
}

function _createInstancePropWithDefaultConfig(userConfig, defaultConfig, instance) {
    for (var prop in defaultConfig) {
        if (defaultConfig.hasOwnProperty(prop)) {
            if (userConfig.hasOwnProperty(prop)) {
                defaultConfig[prop] = userConfig[prop];
            }

            instance[prop] = defaultConfig[prop];
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
    var options = ['separators', 'fold', 'keyboardNavigation'],
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

    if (__WEBPACK_IMPORTED_MODULE_2__config__["a" /* availableThemes */].indexOf(config.theme) === -1) {
        throw new Error('Invalid theme option! available options are ' + __WEBPACK_IMPORTED_MODULE_2__config__["a" /* availableThemes */]);
    }
}

function _validateAndPrepareConfig(config) {
    config = config || {};

    // config.ele required property, it should be a valid html element
    if (!__WEBPACK_IMPORTED_MODULE_0__util_util__["f" /* isValidHtmlElement */](config.ele)) {
        throw Error(config.ele + ' is not a valid HTML element');
    }

    // config.data required property, it should be a obj | array | json
    var configDataPropType = __WEBPACK_IMPORTED_MODULE_0__util_util__["b" /* getType */](config.data);

    if (!_isValidConfigData(configDataPropType)) {
        throw Error('config.data property should be a object '
            + 'or Array or JSON but received ' + configDataPropType);
    }

    // if config.data type is string then, it should be a valid json
    if (configDataPropType === 'string') {
        try {
            config.data = JSON.parse(config.data);
        } catch (e) {
            throw Error('config.data should be valid JSON ' + e);
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
function DomTree(config) {
    config = _validateAndPrepareConfig(config);
    _createInstancePropWithDefaultConfig(config, __WEBPACK_IMPORTED_MODULE_2__config__["b" /* defaultConfig */], this);
}

DomTree.prototype = {
    constructor: DomTree,
    init: function() {
        // if user calling .init() more then once for instance
        if (this.ele.querySelector('ul') !== null) {
            throw new Error('DomTree already initialized for target element!');
        }

        var tree = _constructDomTree(this.data, null);
        tree.className = 'dtjs-root';
        tree.setAttribute('tabIndex', '0');

        // add theme option class
        if (this.theme) {
            tree.className += (' ' + this.theme);
        }

        // if data prop is empty
        if (__WEBPACK_IMPORTED_MODULE_0__util_util__["e" /* isEmpty */](this.data)) {
            this.keyboardNavigation = false; // disable keyboard navigation
            tree.className += ' dtjs-empty';
        }

        tree.addEventListener('focus', function() {
            __WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* handleToggleClass */](tree, 'dtjs-root-focused');
        });

        tree.addEventListener('blur', function() {
            __WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* handleToggleClass */](tree, 'dtjs-root-focused');
        });

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
                __WEBPACK_IMPORTED_MODULE_0__util_util__["c" /* handleToggleClass */](e.target.offsetParent, 'fold');
            }
        }, false);

        // finally append constructed tree to target element :)
        this.ele.appendChild(tree);
    }
};



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["g"] = isValuePrimitive;
/* harmony export (immutable) */ __webpack_exports__["a"] = getLengthOfObjOrArray;
/* harmony export (immutable) */ __webpack_exports__["b"] = getType;
/* harmony export (immutable) */ __webpack_exports__["d"] = isArray;
/* harmony export (immutable) */ __webpack_exports__["f"] = isValidHtmlElement;
/* harmony export (immutable) */ __webpack_exports__["c"] = handleToggleClass;
/* harmony export (immutable) */ __webpack_exports__["e"] = isEmpty;
/**
 * check param is a primitive type
 * @param value - required {valid Js type}
 * @returns {boolean}
 */
function isValuePrimitive(value) {
    if (!arguments.length) throw new Error('Required argument is missing!');

    if (value === null) return true;

    switch (typeof value) {
        case 'string':
        case 'number':
        case 'boolean':
        case 'undefined':
            return true;
        default:
            return false;
    }
}

/**
 * get length of a Array or Object
 * @param param - required {Array || Object}
 * @returns {Number}
 */
function getLengthOfObjOrArray(param) {
    if (!param) throw new Error('Required argument is missing!');

    var type = getType(param);
    if (type === 'array') return param.length;
    if (type === 'object') return Object.keys(param).length;

    throw new TypeError('Argument type should be array or object but received ' + type);
}

function getType(value) {
    if (value === null) {
        return 'null';
    }

    if (isArray(value)) {
        return 'array';
    }

    return typeof value;
}

function isArray(type) {
    return (Object.prototype.toString.call(type) === '[object Array]');
}

function isValidHtmlElement(ele) {
    if (!ele) {
        throw Error('Invalid parameter.!');
    }

    return ele instanceof HTMLElement;
}

function handleToggleClass(ele, targetClassName) {
    var classNamesArr = ele.className.split(' ');
    var index = classNamesArr.indexOf(targetClassName);

    if (index !== -1) {
        var pattern = new RegExp('\\b ' + targetClassName + '\\b', 'i');
        ele.className = ele.className.replace(pattern, '');
    } else {
        ele.className += (' ' + targetClassName);
    }
}

function isEmpty(param) {
    var type = getType(param);

    if (type === 'object' || type === 'array') {
        return getLengthOfObjOrArray(param) === 0;
    }

    throw new Error('param should should be array or object but received ' + type);
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export _isParentNodeRoot */
/* unused harmony export _isElementFolded */
/* unused harmony export _isElementHasChildren */
/* harmony export (immutable) */ __webpack_exports__["b"] = fold;
/* harmony export (immutable) */ __webpack_exports__["a"] = collapse;
/* unused harmony export _addMoveDownClass */
/* unused harmony export _addMoveUpClass */
/* harmony export (immutable) */ __webpack_exports__["d"] = moveUp;
/* harmony export (immutable) */ __webpack_exports__["c"] = moveDown;
function _isParentNodeRoot(ele) {
    return ele.parentNode.classList.contains('dtjs-root');
}

function _isElementFolded(ele) {
    return ele.classList.contains('fold');
}

function _isElementHasChildren(ele) {
    return ele.classList.contains('hc');
}

function fold(ele) {
    _isElementHasChildren(ele) && !_isElementFolded(ele) && ele.classList.add('fold');
}

function collapse(ele) {
    _isElementHasChildren(ele) && _isElementFolded(ele) && ele.classList.remove('fold');
}

function _addMoveDownClass(
    isElementHasChildren, isElementFolded, isParentNodeRoot, firstChild,
    nextSibling, ele
) {
    if (
        isElementHasChildren &&
        !isElementFolded &&
        (!ele.classList.contains('dtjs-mu') || isParentNodeRoot)
    ) {
        if (firstChild && firstChild.classList.contains('hc')) {
            firstChild.className += ' dtjs-md';
        }
    } else {
        nextSibling &&
        nextSibling.classList.contains('hc') &&
        nextSibling.classList.add('dtjs-md');
    }
}

function _addMoveUpClass(
    isElementHasChildren, isElementFolded, isParentNodeRoot, lastChild, previousSibling, ele
) {
    if (
        isElementHasChildren &&
        !isElementFolded &&
        (!ele.classList.contains('dtjs-md') || isParentNodeRoot)
    ) {
        if (lastChild && lastChild.classList.contains('hc')) {
            lastChild.className += ' dtjs-mu';
        }
    } else {
        previousSibling &&
        previousSibling.classList.contains('hc') &&
        previousSibling.classList.add('dtjs-mu');
    }
}

function moveUp(ele) {
    var isParentNodeRoot = _isParentNodeRoot(ele),
        isElementFolded = _isElementFolded(ele);

    // if root node is folded do nothing
    if (isParentNodeRoot && isElementFolded) return;

    var isElementHasChildren = _isElementHasChildren(ele),
        previousSibling = ele.previousSibling,
        lastChild = ele.querySelector('ul') && ele.querySelector('ul').lastChild,
        isEleHasMoveDownClass = ele.classList.contains('dtjs-md');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move up
    _addMoveUpClass(
        isElementHasChildren, isElementFolded, isParentNodeRoot, lastChild, previousSibling, ele
    );

    if (isElementHasChildren && !isElementFolded) {
        if (isEleHasMoveDownClass) {
            ele.classList.remove('dtjs-md');

            if (previousSibling) {
                previousSibling.className += ' dtjs-highlight';
            } else {
                isParentNodeRoot
                    ? lastChild.className += ' dtjs-highlight'
                    : ele.offsetParent.className += ' dtjs-highlight dtjs-md';
            }
        } else {
            // highlight last child
            ele.classList.remove('dtjs-mu');
            lastChild.className += ' dtjs-highlight';
        }
    } else {
        ele.classList.contains('dtjs-mu') && ele.classList.remove('dtjs-mu');
        isEleHasMoveDownClass && ele.classList.remove('dtjs-md');

        previousSibling
            ? previousSibling.className += ' dtjs-highlight'
            : ele.offsetParent.className += ' dtjs-highlight dtjs-md';
    }
}

function moveDown(ele) {
    var isParentNodeRoot = _isParentNodeRoot(ele),
        isElementFolded = _isElementFolded(ele);

    // if root node is folded do nothing
    if (isParentNodeRoot && isElementFolded) return;

    var isElementHasChildren = _isElementHasChildren(ele),
        nextSibling = ele.nextSibling,
        firstChild = ele.querySelector('ul') && ele.querySelector('ul').firstChild,
        isEleHasMoveUpClass = ele.classList.contains('dtjs-mu');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move down
    _addMoveDownClass(
        isElementHasChildren, isElementFolded, isParentNodeRoot, firstChild, nextSibling, ele
    );

    if (isElementHasChildren && !isElementFolded) {
        if (isEleHasMoveUpClass) {
            ele.classList.remove('dtjs-mu');

            if (nextSibling) {
                nextSibling.className += ' dtjs-highlight';
            } else {
                // reached to the root top then highlight it's first element
                isParentNodeRoot
                    ? firstChild.className += ' dtjs-highlight'
                    : ele.offsetParent.className += ' dtjs-highlight dtjs-mu';
            }
        } else {
            // highlight first child
            ele.classList.remove('dtjs-md');
            firstChild.className += ' dtjs-highlight';
        }
    } else {
        ele.classList.contains('dtjs-md') && ele.classList.remove('dtjs-md');
        isEleHasMoveUpClass && ele.classList.remove('dtjs-mu');
        nextSibling
            ? nextSibling.className += ' dtjs-highlight'
            : ele.offsetParent.className += ' dtjs-highlight dtjs-mu';
    }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return availableThemes; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return entryNodeMap; });
var defaultConfig = {
    ele: null,
    data: null,
    separators: true,
    fold: false,
    theme: null,
    keyboardNavigation: false
};

var availableThemes = ['one-dark', 'chrome', 'darcula', 'github'];

var entryNodeMap = {
    'object': { val: '{', className: 'ob' },
    'null': { val: 'null', className: 'null' },
    'array': { val: '[', className: 'ob' },
    'undefined': { val: 'undefined', className: 'undef' },
    'number': { val: null, className: 'num' },
    'boolean': { val: null, className: 'bool' },
    'string': { val: null, className: 'str' }
};


/***/ }),
/* 5 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ])["default"];
});