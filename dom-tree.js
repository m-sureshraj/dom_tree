'use strict';

// helper fn's
var domTreeUtil = (function() {
	function isValuePrimitive(key) {
		if (key === null)
			return true;

		switch (typeof key) {
			case 'string':
			case 'number':
			case 'boolean':
			case 'undefined':
				return true;
				break;
			default:
				return false;
		}
	}

	function getLengthOfObjOrArray(param) {
		return isArray(param)
			? param.length
			: Object.keys(param).length;
	}

	function isArray(type) {
		return (Object.prototype.toString.call(type) === '[object Array]');
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

	return {
		isValuePrimitive: isValuePrimitive,
		getLengthOfObjOrArray: getLengthOfObjOrArray,
		isArray: isArray,
		isValidHtmlElement: isValidHtmlElement,
		handleToggleClass: handleToggleClass,
		getType: getType,
		isEmpty: isEmpty
	};
}());

// keyboard navigation helper
var keyboardNavigation = (function() {
    function _isParentNodeRoot(ele) {
        return ele.parentNode.classList.contains('dtjs-root');
    }

    function _isElementFolded(ele) {
        return ele.classList.contains('fold');
    }

    function _isElementHasChildren(ele) {
        return ele.classList.contains('hc');
    }

    function _addMoveDownClass(
        isElementHasChildren,
        isElementFolded,
        isParentNodeRoot,
        firstChild,
        nextSibling,
        ele
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
        isElementHasChildren,
        isElementFolded,
        isParentNodeRoot,
        lastChild,
        previousSibling,
        ele
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

    function fold(ele) {
        _isElementHasChildren(ele) && !_isElementFolded(ele) && ele.classList.add('fold');
    }

    function collapse(ele) {
        _isElementHasChildren(ele) && _isElementFolded(ele) && ele.classList.remove('fold');
    }

    return {
        moveDown: moveDown,
        moveUp: moveUp,
        fold: fold,
        collapse: collapse
    };
}());

var DomTree = (function(dom, util, kn) {
	var defaultConfig = {
		ele: null,
		data: null,
		separators: true,
		fold: false,
		theme: null,
		keyboardNavigation: false
	};
	var entryNodeMap = {
		'object': { val: '{', className: 'ob' },
		'null': { val: 'null', className: 'null' },
		'array': { val: '[', className: 'ob' },
		'undefined': { val: 'undefined', className: 'undef' },
		'number': { val: null, className: 'num' },
		'boolean': { val: null, className: 'bool' },
		'string': { val: null, className: 'str' }
	};
	var availableThemes = ['one-dark', 'chrome', 'darcula', 'github'];

	function _createEntry(key, value) {
		var entryNode = dom.createElement('li');

		if (key) {
			var keyElement = dom.createElement('span');
			keyElement.className = 'k';
			keyElement.innerHTML = key + ': ';
			entryNode.appendChild(keyElement);
		}

		entryNode.appendChild(_getValueElement(value));

		return entryNode;
	}

	function _getValueElement(value) {
		var type = util.getType(value);
		var entryNodeMapItem = entryNodeMap[type];
		var valueElement = dom.createElement('span');
		value = (type === 'string') ? ('"' + value + '"') : value;

		valueElement.innerHTML = entryNodeMapItem.val || value;
		valueElement.className += entryNodeMapItem.className;

		return valueElement;
	}

	function _constructDomTree(data, root) {
		if (root === null) {
			root = _getRootEntryNode(data);

			var wrapperNode = dom.createElement('ul');
			wrapperNode.appendChild(_constructChildTree(data, root));

			return wrapperNode;
		}

		for (var key in data) {
			if (data.hasOwnProperty(key)) {
				if (util.isValuePrimitive(data[key])) {
					root.appendChild(_createEntry(key, data[key]));
				} else { // else part work same for obj and array
					var val = data[key];
					var entry = _createEntry(key, val);

					root.appendChild(_constructChildTree(val, entry));
				}
			}
		}

		// add separator node to each direct children of root
		if (defaultConfig.separators) {
			_appendSeparatorNodes(root);
		}

		return root;
	}

	function _getRootEntryNode(data) {
		var value = util.isArray(data) ? [] : {};

		return _createEntry(null, value);
	}

	function _appendSeparatorNodes(ele) {
		var childrens = ele.children,
			i = 0,
			// no need to add separator for last children element
			len = (childrens.length - 1);

		for (i; i < len; i++) {
			var separatorNode = dom.createElement('span');
			separatorNode.className = 'sep';
			separatorNode.innerHTML = ',';

			childrens[i].appendChild(separatorNode);
		}
	}

	function _constructChildTree(data, element) {
		var len = util.getLengthOfObjOrArray(data);

		if (len) {
			// element contains children, so add `hc` => `hasChildren` class
			element.className = 'hc';

			// by default all parent node's are collapsed. user can fold it via config
			if (defaultConfig.fold) {
				element.className += ' fold';
			}

			// insert the toggleOptionNode into `element` as a first child
			element.insertBefore(_getToggleOptionNode(), element.firstChild);

			var parentNode = dom.createElement('ul');
			element.appendChild(_constructDomTree(data, parentNode));

			// append ellips node
			element.appendChild(_getEllipseNode());

			// show item count when collapsing wrapper element
			// -cc =>  children-count
			element.setAttribute('data-cc', ('// ' + len + ' Items'));
		}

		element.appendChild(_getCloseWrapperNode(data));

		return element;
	}

	function _getToggleOptionNode() {
		var tagToExpand = dom.createElement('span');
		tagToExpand.className = 'ex'; // `ex` => `expandable`

		return tagToExpand;
	}

	function _getEllipseNode() {
		var ellipsNode = dom.createElement('span');
		ellipsNode.className = 'dots';

		return ellipsNode;
	}

	function _getCloseWrapperNode(param) {
		var closeBlock = dom.createElement('span');
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
				throw Error('config.' + option + ' value should be boolean type');
			}
		}
	}

	function _validateConfigThemeOption(config) {
  		if (typeof config.theme !== 'string') {
			throw Error('config.theme should be a string');
  		}

  		if (availableThemes.indexOf(config.theme) === -1) {
			throw Error('Invalid theme option! available options are ' + availableThemes);
  		}
	}

	function _validateAndPrepareConfig(config) {
		config = config || {};

		// config.ele required property, it should be a valid html element
		if (!util.isValidHtmlElement(config.ele)) {
    		throw Error(config.ele + ' is not a valid HTML element');
  		}

  		// config.data required property, it should be a obj | array | json
		var configDataPropType = util.getType(config.data);

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
		_createInstancePropWithDefaultConfig(config, defaultConfig, this);
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
			if (util.isEmpty(this.data)) {
				this.keyboardNavigation = false; // disable keyboard navigation
				tree.className += ' dtjs-empty';
			}

			tree.addEventListener('focus', function() {
				util.handleToggleClass(tree, 'dtjs-root-focused');
			});

			tree.addEventListener('blur', function() {
				util.handleToggleClass(tree, 'dtjs-root-focused');
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
					util.handleToggleClass(e.target.offsetParent, 'fold');
				}
			}, false);

			// finally append constructed tree to target element :)
			this.ele.appendChild(tree);
		}
	};

	return DomTree;

}(document, domTreeUtil, keyboardNavigation));

// done:
// prepend() not work for other browsers need to polyfill (done)
// check the classList fn support, if it is not support widely then use setAttribute fn (done)
// improve registerEventListener fn (done)
// count after collapsed (done)
// classList.toggle should be polyfilled (done)
// remove es6 and write in pure es5 constructor fn way (done)
// check memory leaks in `toggleOptionNode` click listener (done)
// validation on data input. [must be obj or array or json] (done)
// prevent calling init more then once on same instance (done)
// add separators via configuration (done)
// tree collapse status should be configurable (done)
// add open, close bracket class names for styling purpose (done)
// enable theme option via configuration (done)
// what if user passed a function as a property (done)
// implement full key board navigation feature (done)
// extract keyboard navigation fn into separate helper fn (done)
// optimize for in loop iteration (done)
// refactor _validateConfigBoolOption() calls to single call (done)
// handle keyboard navigation if there are no elements in data prop. eg. {} (done)
// refactor css (done)
// refactor createEntry fn (done)

// todo Before beta release
// how to handle scrolling when tree is focused (working)
// write themes
// create separate file for helpers fn
// testing
// build automation

// todo After beta release
// select IE browser target
// highlight matching bracket (after beta release)
// Array.prototype.indexOf does not work in IE9 need polyfill
// check querySelector() support in IE9
