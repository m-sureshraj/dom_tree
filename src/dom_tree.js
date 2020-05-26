const { constructTree, isValidHtmlElement, configureTree } = require('./lib/dom');
const utils = require('./lib/utils');
const { validateOptions } = require('./lib/validation');
const { defaultOptions } = require('./config');

require('./css/index.css');

function DomTree(options, targetNode) {
    'use strict';

    if (this === undefined) {
        throw Error(
            'DomTree is a constructor function. Should be invoked with `new` keyword'
        );
    }

    if (!isValidHtmlElement(targetNode)) {
        throw TypeError('Target node should be a valid HTML element');
    }

    validateOptions(options);

    const _options = utils.mergeOptions(options, defaultOptions);

    // If the options.data type is a string, then convert to object
    if (typeof options.data === 'string') _options.data = JSON.parse(options.data);

    const tree = constructTree(_options);
    configureTree(tree, _options);

    // methods
    this.init = function() {
        // To prevent calling .init() more than once for the target element
        if (this.initialized) {
            throw Error('DomTree already initialized for the target element!');
        }

        targetNode.appendChild(tree);
        this.initialized = true;
    };
}

module.exports.default = DomTree;
