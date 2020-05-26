const utils = require('./utils');
const config = require('../config');

function validateThemeOption(theme) {
    if (typeof theme !== 'string') {
        throw TypeError('property `theme` should be a type string');
    }

    if (config.availableThemes.indexOf(theme) === -1) {
        const themes = config.availableThemes.join(', ');
        throw Error(`Invalid theme "${theme}". Available themes are: ${themes}`);
    }
}

function validateFormatOption(format) {
    if (typeof format !== 'string') {
        throw TypeError('property `format` should be a type string');
    }

    if (!config.availableFormats[format]) {
        const formats = Object.keys(config.availableFormats).join(', ');
        throw Error(`Invalid format "${format}". Available formats are: ${formats}`);
    }
}

function validateBooleanOptions(userOptions) {
    const booleanOptions = utils.getObjectBooleanValueKeys(config.defaultOptions);

    booleanOptions.forEach(option => {
        if (
            userOptions.hasOwnProperty(option) &&
            typeof userOptions[option] !== 'boolean'
        ) {
            throw Error(`options.${option} value should ba a boolean type`);
        }
    });
}

function isDataValidType(type) {
    return type === 'object' || type === 'array' || type === 'string';
}

function validateDataOption(data) {
    // fixme: for the first version we don't need the update functionality
    // In update mode, data property is optional
    // if (mode === 'update' && !userOptions.hasOwnProperty('data')) return;

    const type = utils.getValueType(data);
    if (!isDataValidType(type)) {
        throw Error(
            `"data" is a required property. It should be an object, array or valid JSON but received ${type}`
        );
    }

    // If the data option type is a string, then it should be a valid JSON
    if (type === 'string') {
        try {
            JSON.parse(data);
        } catch (error) {
            throw TypeError(`property "data" should be a valid JSON ${error}`);
        }
    }
}

function validateOptions(options) {
    const type = utils.getValueType(options);
    if (type !== 'object') {
        throw TypeError(`options must be a type object but received "${type}"`);
    }

    // validate required `data` option
    validateDataOption(options.data);

    // validate optional `theme` option
    if (options.hasOwnProperty('theme')) validateThemeOption(options.theme);

    // validate optional `format` option
    if (options.hasOwnProperty('format')) validateFormatOption(options.format);

    validateBooleanOptions(options);
}

module.exports = {
    validateOptions,
};
