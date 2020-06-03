function getValueType(value) {
    if (!arguments.length) throw Error('Argument is missing!');

    if (value === null) {
        return 'null';
    }

    if (Array.isArray(value)) {
        return 'array';
    }

    return typeof value;
}

function isValuePrimitive(value) {
    if (!arguments.length) throw Error('Argument is missing!');

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

function getLength(value) {
    if (!value) throw Error('Argument is missing!');

    const type = getValueType(value);
    if (type === 'array') return value.length;
    if (type === 'object') return Object.keys(value).length;

    throw TypeError(`Argument type should be an array or object but received: ${type}`);
}

function isEmpty(value) {
    const type = getValueType(value);

    if (type === 'object' || type === 'array') {
        return getLength(value) === 0;
    }

    throw TypeError(`param should be an array or object but received: ${type}`);
}

function getObjectBooleanValueKeys(value) {
    if (getValueType(value) !== 'object') {
        throw TypeError('Argument should be a type `object`');
    }

    return Object.keys(value).filter(key => typeof value[key] === 'boolean');
}

function mergeOptions(options, defaultOptions) {
    const props = Object.keys(defaultOptions);
    const obj = {};

    props.forEach(prop => {
        obj[prop] = options.hasOwnProperty(prop) ? options[prop] : defaultOptions[prop];
    });

    return obj;
}

module.exports = {
    getValueType,
    isValuePrimitive,
    getLength,
    isEmpty,
    getObjectBooleanValueKeys,
    mergeOptions,
};
