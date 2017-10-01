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

module.exports = {
    isValuePrimitive: isValuePrimitive,
    getLengthOfObjOrArray: getLengthOfObjOrArray,
    getType: getType,
    isArray: isArray,
    isValidHtmlElement: isValidHtmlElement,
    handleToggleClass: handleToggleClass,
    isEmpty: isEmpty
};
