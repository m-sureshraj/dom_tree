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

function getLengthOfObjOrArray(param) {
    if (!param) throw new Error('Required argument is missing!');

    var type = getType(param);
    if (type === 'array') return param.length;
    if (type === 'object') return Object.keys(param).length;

    throw new TypeError('Argument type should be array or object but received ' + type);
}

function getType(value) {
    if (!arguments.length) throw new Error('Required argument is missing!');

    if (value === null) {
        return 'null';
    }

    if (isArray(value)) {
        return 'array';
    }

    return typeof value;
}

function isArray(type) {
    if (!arguments.length) throw new Error('Required argument is missing!');

    return Object.prototype.toString.call(type) === '[object Array]';
}

function isValidHtmlElement(ele) {
    if (!ele) {
        throw Error('Invalid parameter.!');
    }

    return ele instanceof HTMLElement;
}

function isEmpty(param) {
    var type = getType(param);

    if (type === 'object' || type === 'array') {
        return getLengthOfObjOrArray(param) === 0;
    }

    throw new Error('param should be array or object but received ' + type);
}

function getBooleanOptionsFromObject(obj) {
    if (typeof obj !== 'object') {
        throw new Error('Argument should be a type `object`');
    }

    var booleanOptions = [];

    for (var key in obj) {
        /* istanbul ignore else */
        if (obj.hasOwnProperty(key)) {
            typeof obj[key] === 'boolean' && booleanOptions.push(key);
        }
    }

    return booleanOptions;
}

function mergeConfig(target, source) {
    var o = {};

    for (var prop in target) {
        /* istanbul ignore else */
        if (target.hasOwnProperty(prop)) {
            o[prop] = source.hasOwnProperty(prop) ? source[prop] : target[prop];
        }
    }

    return o;
}

// JSON.stringify will ignore methods on object
function deepClone(source) {
    return JSON.parse(JSON.stringify(source));
}

function diff(prevConfig, updatedConfig) {
    var o = {},
        prevVal,
        updatedVal;

    for (var prop in prevConfig) {
        /* istanbul ignore else */
        if (prevConfig.hasOwnProperty(prop) && updatedConfig.hasOwnProperty(prop)) {
            prevVal = prevConfig[prop];
            updatedVal = updatedConfig[prop];

            // we can directly compare primitive values
            if (isValuePrimitive(updatedVal) && prevVal !== updatedVal) {
                o[prop] = updatedVal;
            } else if (JSON.stringify(prevVal) !== JSON.stringify(updatedVal)) {
                // compare array, object
                // for our use case we can't use any `deepEqual` related packages.
                // * deepEqual does not care about order of properties, but our case we need
                //   that behavior. deepEqual({a: 1, b: 2}, {b: 2, a: 1}); // true
                o[prop] = updatedVal;
            }
        }
    }

    return o;
}

function contains(haystack, arr) {
    return arr.some(function(v) {
        return haystack.indexOf(v) !== -1;
    });
}

module.exports = {
    isValuePrimitive: isValuePrimitive,
    getLengthOfObjOrArray: getLengthOfObjOrArray,
    getType: getType,
    isArray: isArray,
    isValidHtmlElement: isValidHtmlElement,
    isEmpty: isEmpty,
    getBooleanOptionsFromObject: getBooleanOptionsFromObject,
    mergeConfig: mergeConfig,
    deepClone: deepClone,
    diff: diff,
    contains: contains,
};
