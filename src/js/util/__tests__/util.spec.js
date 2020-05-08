const util = require('../util');

describe('Test utility helper functions', () => {
    describe('isValuePrimitive:', () => {
        test('should throw error if argument is missing', () => {
            expect(() => {
                util.isValuePrimitive();
            }).toThrowError();
        });

        test('should return true for primitive values', () => {
            expect(util.isValuePrimitive('string')).toBeTruthy();
            expect(util.isValuePrimitive(2)).toBeTruthy();
            expect(util.isValuePrimitive(null)).toBeTruthy();
            expect(util.isValuePrimitive(undefined)).toBeTruthy();
            expect(util.isValuePrimitive(true)).toBeTruthy();
        });

        test('should return false for reference types', () => {
            expect(util.isValuePrimitive([])).toBeFalsy();
            expect(util.isValuePrimitive({})).toBeFalsy();
        });
    });

    describe('getLengthOfObjOrArray:', () => {
        test('should throw error if argument is missing or invalid', () => {
            expect(() => {
                util.getLengthOfObjOrArray();
            }).toThrowError();
            expect(() => {
                util.getLengthOfObjOrArray('text');
            }).toThrowError();
        });

        test('should return correct length for valid argument', () => {
            expect(util.getLengthOfObjOrArray([1, 2])).toBe(2);
            expect(util.getLengthOfObjOrArray({ name: 'foo', age: 10 })).toBe(2);
        });
    });

    describe('getType:', () => {
        test('should throw error if argument is missing', () => {
            expect(() => {
                util.getType();
            }).toThrowError();
        });

        test('should return valid type', () => {
            expect(util.getType('text')).toEqual('string');
            expect(util.getType(null)).toEqual('null');
            expect(util.getType([])).toEqual('array');
            expect(util.getType({})).toEqual('object');
            expect(util.getType(true)).toEqual('boolean');
        });
    });

    describe('isArray:', () => {
        test('should throw error if argument is missing', () => {
            expect(() => {
                util.isArray();
            }).toThrowError();
        });

        test('should return true if argument type is array', () => {
            expect(util.isArray([])).toBeTruthy();
            expect(util.isArray({})).toBeFalsy();
        });
    });

    describe('isValidHtmlElement:', () => {
        test('should throw error if argument is missing', () => {
            expect(() => {
                util.isValidHtmlElement();
            }).toThrowError();
        });

        test('should return true for valid dom element', () => {
            const ele = document.createElement('span');

            expect(util.isValidHtmlElement(ele)).toBeTruthy();
            expect(util.isValidHtmlElement('span')).toBeFalsy();
        });
    });

    describe('contains:', () => {
        test('should return true if one of the value exists on the array', () => {
            expect(util.contains(['one'], ['foo', 'bar', 'one'])).toBeTruthy();
            expect(util.contains(['two'], ['foo', 'bar', 'one'])).toBeFalsy();
            expect(util.contains(['foo', 'bar'], ['foo', 'bar', 'one'])).toBeTruthy();
        });
    });

    describe('getBooleanOptionsFromObject:', () => {
        test('should throw error if argument is missing or invalid', () => {
            expect(() => {
                util.getBooleanOptionsFromObject();
            }).toThrowError();
            expect(() => {
                util.getBooleanOptionsFromObject('hello');
            }).toThrowError();
        });

        test('should return all boolean options from object', () => {
            const defaultConfig = {
                data: null,
                theme: 'dtjs-default-theme',
                format: 'object',
                fold: false,
                separators: true,
            };

            expect(util.getBooleanOptionsFromObject(defaultConfig)).toEqual([
                'fold',
                'separators',
            ]);
        });
    });

    describe('isEmpty:', () => {
        test('should throw error if argument is missing or invalid', () => {
            expect(() => {
                util.isEmpty();
            }).toThrowError();
            expect(() => {
                util.isEmpty('hello');
            }).toThrowError();
        });

        test('should return true if array or object is empty', () => {
            expect(util.isEmpty([])).toBeTruthy();
            expect(util.isEmpty({})).toBeTruthy();
            expect(util.isEmpty({ name: 'foo' })).toBeFalsy();
        });
    });

    describe('deepClone:', () => {
        test('should return cloned object', () => {
            const original = { name: 'foo', age: 100 };
            const clonedObj = util.deepClone(original);

            expect(original == clonedObj).toBeFalsy();
            expect(original).toEqual(clonedObj);
        });
    });

    describe('mergeConfig:', () => {
        test('should return merged object', () => {
            const target = { name: 'foo', age: 100, isMarried: false };
            const source = { name: 'bar', isMarried: true };

            expect(util.mergeConfig(target, source)).toEqual({
                name: 'bar',
                age: 100,
                isMarried: true,
            });
        });
    });

    describe('diff', () => {
        test('should return different values', () => {
            const config = {
                movies: ['starwars', 'up'],
                count: 3,
                length: '1560',
                created: {
                    date: '2017-Dec-21',
                    time: '3.00 pm',
                },
            };
            const updatedConfig = {
                movies: ['up', 'starwars'],
                count: 4,
                length: '1560',
                created: {
                    date: '2017-Dec-21',
                    time: '3.00 am',
                },
            };

            expect(util.diff(config, updatedConfig)).toEqual({
                movies: ['up', 'starwars'],
                count: 4,
                created: {
                    date: '2017-Dec-21',
                    time: '3.00 am',
                },
            });
        });
    });
});
