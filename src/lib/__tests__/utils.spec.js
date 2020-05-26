const {
    isValuePrimitive,
    getValueType,
    getLength,
    isEmpty,
    getObjectBooleanValueKeys,
    mergeOptions,
} = require('../utils');

describe('isValuePrimitive', () => {
    it('should throw an error if argument is missing', () => {
        expect(() => {
            isValuePrimitive();
        }).toThrow();
    });

    it('should return true for primitive values', () => {
        expect(isValuePrimitive('string')).toBeTruthy();
        expect(isValuePrimitive(2)).toBeTruthy();
        expect(isValuePrimitive(null)).toBeTruthy();
        expect(isValuePrimitive(undefined)).toBeTruthy();
        expect(isValuePrimitive(true)).toBeTruthy();
    });

    it('should return false for reference types', () => {
        expect(isValuePrimitive([])).toBeFalsy();
        expect(isValuePrimitive({})).toBeFalsy();
    });
});

describe('getValueType', () => {
    it('should throw an error if argument is missing', () => {
        expect(() => {
            getValueType();
        }).toThrow();
    });

    it('should return valid type', () => {
        expect(getValueType('text')).toEqual('string');
        expect(getValueType(null)).toEqual('null');
        expect(getValueType([])).toEqual('array');
        expect(getValueType({})).toEqual('object');
        expect(getValueType(true)).toEqual('boolean');
    });
});

describe('getLength', () => {
    it('should throw an error if argument is missing or invalid', () => {
        expect(() => {
            getLength();
        }).toThrow();
        expect(() => {
            getLength('text');
        }).toThrow();
    });

    it('should return correct length for valid argument', () => {
        expect(getLength([1, 2])).toBe(2);
        expect(getLength({ name: 'foo', age: 10 })).toBe(2);
    });
});

describe('isEmpty', () => {
    it('should throw an error if argument is missing or invalid', () => {
        expect(() => {
            isEmpty();
        }).toThrow();
        expect(() => {
            isEmpty('hello');
        }).toThrow();
    });

    it('should return true if an array or object is empty', () => {
        expect(isEmpty([])).toBeTruthy();
        expect(isEmpty({})).toBeTruthy();
        expect(isEmpty({ name: 'foo' })).toBeFalsy();
    });
});

describe('getBooleanValueKeys', () => {
    it('should throw an error if argument is missing or invalid', () => {
        expect(() => {
            getObjectBooleanValueKeys();
        }).toThrow();
        expect(() => {
            getObjectBooleanValueKeys('hello');
        }).toThrow();
    });

    it('should return all boolean options from object', () => {
        const defaultConfig = {
            data: null,
            theme: 'dt-default-theme',
            format: 'object',
            fold: false,
            separators: true,
        };

        expect(getObjectBooleanValueKeys(defaultConfig)).toEqual(['fold', 'separators']);
    });
});

describe('mergeOptions', () => {
    it('should not pick unknown properties from the received options', () => {
        const receivedOptions = {
            foo: 'foo',
            unknownProp: 'who cares',
        };
        const defaultOptions = {
            foo: 'foo',
        };

        expect(mergeOptions(receivedOptions, defaultOptions)).toEqual({
            foo: 'foo',
        });
    });

    it('should use known property values from the received options', () => {
        const receivedOptions = {
            foo: '__foo__',
            bar: '__bar__',
        };
        const defaultOptions = {
            foo: 'FOO',
            bar: 'BAR',
        };

        expect(mergeOptions(receivedOptions, defaultOptions)).toEqual({
            foo: '__foo__',
            bar: '__bar__',
        });
    });
});
