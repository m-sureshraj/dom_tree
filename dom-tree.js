'use strict';

// helper fn's
var DomTreeUtil = (function() {
	/**
	 * check key is a valid primitive type
	 * @param { Any } key - js type eg. string | number | etc..
	 * @return { Boolean }
	 */
	function isValuePrimitive(key) {
		if (key === null)
			return true;

		const type = typeof key;

		switch (type) {
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

	return {
		isValuePrimitive: isValuePrimitive,
		getLengthOfObjOrArray: getLengthOfObjOrArray,
		isArray: isArray,
		isValidHtmlElement: isValidHtmlElement,
		handleToggleClass: handleToggleClass,
		getType: getType
	};
}());

var DomTree = (function(dom, util) {
	var defaultConfig = {
		ele: null,
		data: null,
		separators: true,
		fold: false,
		theme: null
	};

	var availableThemes = [
		'one-dark',
		'chrome',
		'darcula',
		'github'
	];

	function _createEntry(key, value) {
		var entryNode = dom.createElement('li');
		// entryNode.className = 'e';

		if (key) {
			var keyElement = dom.createElement('span');
			keyElement.className = 'k';
			keyElement.innerHTML = key + ': ';
			entryNode.appendChild(keyElement);
		}

		var valueElement = dom.createElement('span');
		// valueElement.className = 'v';

		var type = util.getType(value);

		if (type === 'string') {
			valueElement.innerHTML = '"' + value + '"';
			valueElement.className += ' str';
		} else if (type === 'object') {
			valueElement.innerHTML = '{';
			valueElement.className = 'ob'; // openBracket
		} else if (type === 'null') {
			valueElement.innerHTML = 'null';
			valueElement.className += ' null';
		} else if (type === 'array') {
			valueElement.innerHTML = '[';
			valueElement.className = 'ob';
		} else if (type === 'number') {
			valueElement.innerHTML = value;
			valueElement.className += ' num';
		} else if (type === 'boolean') {
			valueElement.innerHTML = value;
			valueElement.className += ' bool';
		} else if (type === 'undefined') {
			valueElement.innerHTML = 'undefined';
			valueElement.className += ' undef';
		} else {
			throw Error(value + ' not a valid type.!');
		}

		entryNode.appendChild(valueElement);

		return entryNode;
	}

	function _constructDomTree(data, root) {
		if (root === null) {
			root = _getRootEnteryNode(data);

			var wrapperNode = dom.createElement('ul');
			wrapperNode.appendChild(_constructChildTree(data, root));

			return wrapperNode;
		}

		for (var key in data) {
			if (util.isValuePrimitive(data[key])) {
				root.appendChild(_createEntry(key, data[key]));
			} else { // else part work same for obj and array
				var val = data[key];
				var entry = _createEntry(key, val);

				root.appendChild(_constructChildTree(val, entry));
			}
		}

		// add separator node to each direct children of root
		if (defaultConfig.separators) {
			_appendSeparatorNodes(root);
		}

		return root;
	}

	function _getRootEnteryNode(data) {
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
			// we can easily do with ele.prepend() method, but older browsers not support
			// for this method
			element.insertBefore(_getToggleOptionNode(), element.firstChild);

			var parentNode = dom.createElement('ul');
			element.appendChild(_constructDomTree(data, parentNode));

			// append ellips node
			element.appendChild(_getEllipsNode());

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

	function _getEllipsNode() {
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

	function _createInstancePropWithDefaultConfig(userConfig, defaultConfig, instance) {
		for (var prop in defaultConfig) {
			if (userConfig.hasOwnProperty(prop)) {
				defaultConfig[prop] = userConfig[prop];
			}

			instance[prop] = defaultConfig[prop];
		}
	}

	function _isValidConfigData(type) {
		return (
			type === 'object' ||
			type === 'array' ||
  			type === 'string'
  		);
	}

	function _validateConfigBoolOption(config, option) {
		if (config.hasOwnProperty(option) && typeof config[option] !== 'boolean') {
  			throw Error('config.' + option + ' value should be boolean type');
  		}
	}

	function _validateConfigThemeOption(config) {
  		if (typeof config.theme !== 'string') {
			throw Error('config.theme should be a string');
  		}

  		if (availableThemes.indexOf(config.theme) === -1) {
			throw Error('Invalid theme option.! available options are ' + availableThemes);
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
				+ 'or Array or Json but received ' + configDataPropType);
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

  		// if optional config.separators property present, then it should be a boolean type
  		_validateConfigBoolOption(config, 'separators');

  		// if optional config.fold property present, then it should be a boolean type
		_validateConfigBoolOption(config, 'fold');

  		return config;
	}

	// @constuctor
	function DomTree(config) {
		config = _validateAndPrepareConfig(config);
		_createInstancePropWithDefaultConfig(config, defaultConfig, this);
	}

	DomTree.prototype = {
		constuctor: DomTree,
		init: function() {
			var tree = _constructDomTree(this.data, null);
			tree.className = 'domTreeJsRoot';

			// add theme option class
			if (this.theme) {
				tree.className += (' ' + this.theme);
			}

			// register click event listener on toggleOption node via eventDelegation
			tree.addEventListener('click', function(e) {
				if (e.target && e.target.className === 'ex') {
					util.handleToggleClass(e.target.offsetParent, 'fold');
				}
			}, false);

			// what if user calling .init() more then once for a instance
			// append tree only if this.ele is empty
			if (this.ele.querySelector('ul') === null) {
				this.ele.appendChild(tree);
			}
		}
	};

	return DomTree;

}(document, DomTreeUtil));

// done:
// prepend() not work for other browsers need to polyfill (done)
// check the classList fn support, if it is not support widely then use setAttribute fn (done)
// improve registerEventListener fn (done)
// count after collapsed (done)
// classList.toggle should be polyfilled (done)
// remove es6 and write in pure es5 constuctor fn way (done)
// check memory leaks in `toggleOptionNode` click listener (done)
// validation on data input. [must be obj or array or json] (done)
// prevent calling init more then once on same instance (done)
// add separators via configuration (done)
// tree collapse status should be configurable (done)
// add open, close bracket class names for styling purpose (done)
// enable theme option via configuration (done)
// implement full key board navigation feature (working)

// todo
// refactor createEntry fn (must)
// highlight matching bracket
// Array.prototype.indexOf does not work in IE9 need polyfill

// later
// create separate file for helpers fn
// browser target IE9 and above

// http://stackoverflow.com/questions/3656467/is-it-possible-to-focus-on-a-div-using-javascript-focus-function