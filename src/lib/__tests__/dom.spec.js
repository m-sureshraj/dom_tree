const { getByText, fireEvent } = require('@testing-library/dom');

const { isValidHtmlElement, constructTree, configureTree } = require('../dom');
const { classNames, availableThemes } = require('../../config');

const keys = {
    arrowLeft: 37,
    arrowUp: 38,
    arrowRight: 39,
    arrowDown: 40,
};

describe('isValidHtmlElement', () => {
    it('should return true for valid dom element', () => {
        const ele = document.createElement('span');

        expect(isValidHtmlElement()).toBeFalsy();
        expect(isValidHtmlElement(ele)).toBeTruthy();
        expect(isValidHtmlElement('span')).toBeFalsy();
    });
});

describe('constructTree', () => {
    it('should construct empty tree for empty data', () => {
        expect(constructTree({ data: {} })).toMatchSnapshot();
        expect(constructTree({ data: [] })).toMatchSnapshot();
    });

    it('should recursively construct the tree for nested objects, array', () => {
        const data = {
            location: {
                district: 'foo',
                province: 'bar',
                coordinates: {
                    lat: 3.2658,
                    long: 5.3698,
                },
            },
            otherNames: ['baz', '__^__'],
        };

        expect(constructTree({ data })).toMatchSnapshot();
    });

    it('should use data attributes to keep children count', () => {
        const data = {
            names: ['foo', 'bar', 'baz'],
            coordinates: {
                lat: 3.2658,
                long: 5.3698,
            },
        };
        const tree = constructTree({ data });

        expect(tree.firstChild).toHaveAttribute(
            'data-cc',
            `// ${Object.keys(data).length} Items`
        );
        expect(getByText(tree, 'names').parentElement).toHaveAttribute(
            'data-cc',
            `// ${data.names.length} Items`
        );
        expect(getByText(tree, 'coordinates').parentElement).toHaveAttribute(
            'data-cc',
            `// ${Object.keys(data.coordinates).length} Items`
        );
    });

    it('should add a class to element if it has children', () => {
        const data = {
            names: ['foo', 'bar', 'baz'],
        };
        const tree = constructTree({ data });

        expect(tree.firstChild).toHaveClass(classNames.hasChildren);
        expect(getByText(tree, 'names').parentElement).toHaveClass(
            classNames.hasChildren
        );
    });

    it('should fold elements', () => {
        const options = {
            fold: true,
            data: {
                lat: 3.2658,
                long: 5.3698,
            },
        };
        const tree = constructTree(options);

        expect(tree.firstChild).toHaveClass(classNames.fold);
    });

    it('should not add separators', () => {
        const options = {
            separators: false,
            data: {
                lat: 3.2658,
                long: 5.3698,
            },
        };
        const tree = constructTree(options);

        expect(tree.querySelector(`.${classNames.separator}`)).toBeNull();
        expect(tree).toMatchSnapshot();
    });
});

describe('configureTree', () => {
    it('tree should be themeable', () => {
        const options = {
            data: {
                name: 'foo',
                age: 100,
            },
            theme: availableThemes[1],
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        expect(tree).toHaveClass(`${classNames.root} ${classNames['one-dark']}`);
    });

    test('tree should not focusable when data is empty', () => {
        const options = {
            data: {},
            theme: availableThemes[1],
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        expect(tree).not.toHaveAttribute('tabIndex', 0);
        expect(tree).toHaveClass(classNames.empty);

        fireEvent.focus(tree);
        expect(tree).not.toHaveClass(classNames.treeFocused);
    });

    test('tree should be focusable when data is not empty', () => {
        const options = {
            data: {
                name: 'foo',
                age: 100,
            },
            theme: availableThemes[1],
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        expect(tree).toHaveClass(classNames.treeFocused);

        fireEvent.blur(tree);
        expect(tree).not.toHaveClass(classNames.treeFocused);
    });

    it('should remove highlight on blur', () => {
        const options = {
            data: {
                name: 'foo',
                age: 100,
                location: ['foo', 'bar'],
            },
            theme: availableThemes[1],
            removeHighlightOnBlur: true,
            keyboardNavigation: true,
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });
        expect(tree.firstChild).toHaveClass(`${classNames.highlight}`);

        fireEvent.blur(tree);
        expect(tree.firstChild).not.toHaveClass(`${classNames.highlight}`);
    });

    it('should not remove highlight on blur', () => {
        const options = {
            data: {
                name: 'foo',
                age: 100,
            },
            theme: availableThemes[1],
            removeHighlightOnBlur: false,
            keyboardNavigation: true,
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });
        expect(tree.firstChild).toHaveClass(`${classNames.highlight}`);

        fireEvent.blur(tree);
        expect(tree.firstChild).toHaveClass(`${classNames.highlight}`);
    });

    it('should be able to fold/expand sub trees by clicking toggle option node', () => {
        const options = {
            data: {
                name: 'foo',
                age: 100,
                location: ['a', 'b'],
            },
            theme: availableThemes[1],
        };
        const tree = constructTree(options);
        configureTree(tree, options);

        const toggleNodes = tree.querySelectorAll(`.${classNames.expandable}`);
        fireEvent.click(toggleNodes[0]);
        fireEvent.click(toggleNodes[1]);

        expect(toggleNodes[0].parentNode).toHaveClass(classNames.fold);
        expect(toggleNodes[1].parentNode).toHaveClass(classNames.fold);
    });
});

describe('navigation', () => {
    let options = {};
    beforeEach(() => {
        options = {
            data: {
                name: 'foo',
                age: 100,
                location: ['a', 'b'],
            },
            theme: availableThemes[1],
            keyboardNavigation: true,
        };
    });

    it('should be able to disable the navigation', () => {
        options.keyboardNavigation = false;
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });

        expect(tree.querySelector(`.${classNames.highlight}`)).toBeNull();
    });

    it("should highlight tree's first child if I press an arrow key first time", () => {
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });

        expect(tree.firstChild).toHaveClass(
            `${classNames.highlight} ${classNames.moveDown}`
        );
    });

    it('should do nothing if I press other than arrow keys', () => {
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);

        const spaceKey = 32;
        fireEvent.keyDown(tree, { keyCode: spaceKey });

        expect(tree.firstChild).not.toHaveClass(classNames.highlight);
    });

    it('should be able to fold/expand sub trees via left/right keys', () => {
        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });

        // fold the root
        fireEvent.keyDown(tree, { keyCode: keys.arrowLeft });
        expect(tree.firstChild).toHaveClass(classNames.fold);

        // expand the root
        fireEvent.keyDown(tree, { keyCode: keys.arrowRight });
        expect(tree.firstChild).not.toHaveClass(classNames.fold);

        // to find next sub tree
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });

        // fold the sub tree
        fireEvent.keyDown(tree, { keyCode: keys.arrowLeft });
        expect(tree.querySelector(`.${classNames.highlight}`)).toHaveClass(
            classNames.fold
        );

        // expand the sub tree
        fireEvent.keyDown(tree, { keyCode: keys.arrowRight });
        expect(tree.querySelector(`.${classNames.highlight}`)).not.toHaveClass(
            classNames.fold
        );
    });

    it('should be able to navigate upwards', () => {
        options.data = {
            name: 'foo',
            first: {
                second: {
                    third: {
                        hello: 'world',
                    },
                },
            },
        };

        const tree = constructTree(options);
        configureTree(tree, options);

        fireEvent.focus(tree);
        fireEvent.keyDown(tree, { keyCode: keys.arrowDown });

        fireEvent.keyDown(tree, { keyCode: keys.arrowUp });
        expect(getByText(tree, 'first').parentNode).toHaveClass(classNames.highlight);

        fireEvent.keyDown(tree, { keyCode: keys.arrowUp });
        expect(getByText(tree, 'second').parentNode).toHaveClass(classNames.highlight);

        fireEvent.keyDown(tree, { keyCode: keys.arrowUp });
        expect(getByText(tree, 'third').parentNode).toHaveClass(classNames.highlight);

        fireEvent.keyDown(tree, { keyCode: keys.arrowUp });
        expect(getByText(tree, 'hello').parentNode).toHaveClass(classNames.highlight);

        // fixme: uncomment following lines after replacing `offsetParent` dom api with `parentNode`
        // fireEvent.keyDown(tree, { keyCode: keys.arrowUp });
        // expect(getByText(tree, 'third').parentNode).toHaveClass(classNames.highlight);
    });
});
