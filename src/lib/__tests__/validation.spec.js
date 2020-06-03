const { validateOptions } = require('../validation');
const config = require('../../config');

it('should throw an error if the provided options type is not an object', () => {
    const options = null;

    expect(() => {
        validateOptions(options);
    }).toThrow('options must be a type object but received "null"');
});

describe('validate theme option', () => {
    it('should throw an error if the provided theme type is not a string', () => {
        const options = { theme: null, data: {} };

        expect(() => {
            validateOptions(options);
        }).toThrow('property `theme` should be a type string');
    });

    it('should throw an error for invalid theme', () => {
        const theme = 'foo';
        const options = { theme, data: {} };
        const availableThemes = config.availableThemes.join(', ');

        expect(() => {
            validateOptions(options);
        }).toThrow(`Invalid theme "${theme}". Available themes are: ${availableThemes}`);
    });

    it('should not throw an exception for a valid theme', () => {
        const options = { theme: 'rose', data: {} };

        expect(() => {
            validateOptions(options);
        }).not.toThrow();
    });
});

describe('validate format option', () => {
    it('should throw an error if the provided format type is not a string', () => {
        const options = { format: null, data: {} };

        expect(() => {
            validateOptions(options);
        }).toThrow('property `format` should be a type string');
    });

    it('should throw an error for invalid format', () => {
        const format = 'foo';
        const options = { format, data: {} };
        const formats = Object.keys(config.availableFormats).join(', ');

        expect(() => {
            validateOptions(options);
        }).toThrow(`Invalid format "${format}". Available formats are: ${formats}`);
    });

    it('should not throw an exception for a valid format', () => {
        const options = { format: config.availableFormats.json, data: {} };

        expect(() => {
            validateOptions(options);
        }).not.toThrow();
    });
});

describe('validate boolean options', () => {
    it('should throw an error if known boolean options receive non-boolean types as a value', () => {
        const options = {
            data: [],
            fold: 'what??',
            separators: false,
            keyboardNavigation: false,
            removeHighlightOnBlur: false,
        };

        expect(() => {
            validateOptions(options);
        }).toThrow('options.fold value should ba a boolean type');
    });

    it('should not throw an exception if unknown options contain non-boolean types as a value', () => {
        const options = {
            data: [],
            whoAmI: true,
        };

        expect(() => {
            validateOptions(options);
        }).not.toThrow();
    });
});

describe('validate data option', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if the data option is missing', () => {
        const options = {};

        expect(() => {
            validateOptions(options);
        }).toThrow(
            '"data" is a required property. It should be an object, array or valid JSON but received undefined'
        );
    });

    it('should throw an error for invalid type', () => {
        const options = {
            data: true,
        };

        expect(() => {
            validateOptions(options);
        }).toThrow(
            '"data" is a required property. It should be an object, array or valid JSON but received boolean'
        );
    });

    it('should not throw an exception for valid type', () => {
        const options = {
            data: {},
        };

        expect(() => {
            validateOptions(options);
        }).not.toThrow();
    });

    test('when the data option type is a string, then it should be a valid JSON', () => {
        const spiedParse = jest.spyOn(JSON, 'parse');
        const options = {
            data: 'i am a invalid json',
        };

        expect(() => {
            validateOptions(options);
        }).toThrow();
        expect(spiedParse).toHaveBeenCalledWith(options.data);
    });

    it('should not throw an exception for valid JSON', () => {
        const obj = { foo: 'foo' };
        const options = {
            data: JSON.stringify(obj),
        };

        expect(() => {
            validateOptions(options);
        }).not.toThrow();
    });
});
