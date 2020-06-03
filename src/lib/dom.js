const { entryNodeTypes, classNames, availableFormats } = require('../config');
const { getValueType, isValuePrimitive, getLength, isEmpty } = require('./utils');
const { toggleExpand, removeHighlight, handleKeyboardNavigation } = require('./events');

function getColonNode() {
    const colonNode = document.createElement('span');
    colonNode.className = classNames.colon;
    colonNode.innerHTML = ': ';

    return colonNode;
}

function getKeyNode(key, format) {
    const keyNode = document.createElement('span');
    keyNode.className = classNames.key;
    keyNode.innerHTML = format === availableFormats.json ? `"${key}"` : key;

    return keyNode;
}

function getValueElement(value) {
    const valueNode = document.createElement('span');
    const type = getValueType(value);
    const entryNodeType = entryNodeTypes[type];

    value = type === 'string' ? `"${value}"` : value;
    valueNode.innerHTML = entryNodeType.val || value;
    valueNode.className += entryNodeType.className;

    return valueNode;
}

function createEntry(key, value, format) {
    const entryNode = document.createElement('li');

    if (key) {
        const keyElement = getKeyNode(key, format);
        keyElement.appendChild(getColonNode());
        entryNode.appendChild(keyElement);
    }

    entryNode.appendChild(getValueElement(value));

    return entryNode;
}

function getToggleOptionNode() {
    const toggleNode = document.createElement('span');
    toggleNode.className = classNames.expandable;

    return toggleNode;
}

function getEllipseNode() {
    const ellipseNode = document.createElement('span');
    ellipseNode.className = classNames.dots;

    return ellipseNode;
}

function getClosingNode(data) {
    const closingNode = document.createElement('span');
    closingNode.className = classNames.closeBracket;
    closingNode.innerHTML = Array.isArray(data) ? ']' : '}';

    return closingNode;
}

function appendSeparators({ children }) {
    // no need to add a separator for the last children
    const length = children.length - 1;
    let separatorNode;

    for (let i = 0; i < length; i++) {
        separatorNode = document.createElement('span');
        separatorNode.className = classNames.separator;
        separatorNode.innerHTML = ',';

        children[i].appendChild(separatorNode);
    }
}

function getRootEntryNode(data) {
    const value = Array.isArray(data) ? [] : {};

    return createEntry(null, value);
}

function isValidHtmlElement(ele) {
    return ele instanceof HTMLElement;
}

function constructTree(options, rootEntryNode = null) {
    if (!rootEntryNode) {
        rootEntryNode = getRootEntryNode(options.data);

        const wrapperNode = document.createElement('ul');
        wrapperNode.appendChild(constructChildTree(options, rootEntryNode));

        return wrapperNode;
    }

    let entryNode = null,
        value = null;

    Object.keys(options.data).forEach(key => {
        value = options.data[key];
        entryNode = createEntry(key, value, options.format);

        if (isValuePrimitive(value)) {
            rootEntryNode.appendChild(entryNode);
        } else {
            rootEntryNode.appendChild(
                constructChildTree({ ...options, data: value }, entryNode)
            );
        }
    });

    if (options.separators) appendSeparators(rootEntryNode);

    return rootEntryNode;
}

function constructChildTree(options, element) {
    const childrenCount = getLength(options.data);

    if (childrenCount) {
        element.className = classNames.hasChildren;

        if (options.fold) element.className += ` ${classNames.fold}`;

        element.insertBefore(getToggleOptionNode(), element.firstChild);
        element.appendChild(constructTree(options, document.createElement('ul')));
        element.appendChild(getEllipseNode());
        element.setAttribute('data-cc', `// ${childrenCount} Items`);
    }

    element.appendChild(getClosingNode(options.data));

    return element;
}

function configureTree(tree, options) {
    tree.className = `${classNames.root} ${classNames[options.theme]}`;

    if (isEmpty(options.data)) {
        tree.className += ` ${classNames.empty}`;
        return;
    }

    tree.setAttribute('tabIndex', '0');

    tree.addEventListener('focus', function() {
        tree.classList.add(classNames.treeFocused);
    });

    tree.addEventListener('blur', function() {
        tree.classList.remove(classNames.treeFocused);
    });

    if (options.removeHighlightOnBlur) {
        tree.addEventListener('blur', removeHighlight);
    }

    if (options.keyboardNavigation) {
        tree.addEventListener('keydown', handleKeyboardNavigation);
    }

    tree.addEventListener('click', toggleExpand);
}

module.exports = {
    constructTree,
    isValidHtmlElement,
    configureTree,
};
