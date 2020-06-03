const dom = require('./lib/dom');
const spiedConstructTree = jest.spyOn(dom, 'constructTree');

const DomTree = require('./dom_tree').default;
const { availableFormats, availableThemes } = require('./config');

describe('DomTree', () => {
    let options = null;
    let targetNode = null;
    beforeEach(() => {
        options = { data: { name: 'foo' } };
        targetNode = document.createElement('div');
    });

    it('should throw an exception if it is invoked without `new` keyword', () => {
        expect(() => {
            DomTree();
        }).toThrow(
            'DomTree is a constructor function. Should be invoked with `new` keyword'
        );
    });

    it('should throw an exception if the target node is not a valid HTML element', () => {
        const targetNode = 'i should be a html';

        expect(() => {
            new DomTree({}, targetNode);
        }).toThrow('Target node should be a valid HTML element');
    });

    it('should use the default options when optional options are missing', () => {
        new DomTree(options, targetNode);

        expect(spiedConstructTree).toHaveBeenCalledWith({
            ...options,
            theme: availableThemes[0],
            format: availableFormats.object,
            fold: false,
            separators: true,
            keyboardNavigation: false,
            removeHighlightOnBlur: false,
        });
    });

    it('should throw an error if user tries to initialize `DomTree` more then once', () => {
        const tree = new DomTree(options, targetNode);
        tree.init();

        expect(() => {
            tree.init();
        }).toThrow('DomTree already initialized for the target element!');
    });

    it('should append the generated tree to the target element', () => {
        const tree = new DomTree(options, targetNode);
        tree.init();

        expect(targetNode).toMatchSnapshot();
        expect(targetNode.children).toHaveLength(1);
    });

    it('should append multiple trees into the same target node', () => {
        const fooTree = new DomTree(options, targetNode);
        const barTree = new DomTree(options, targetNode);
        fooTree.init();
        barTree.init();

        expect(targetNode).toMatchSnapshot();
        expect(targetNode.children).toHaveLength(2);
    });

    it('should generate a tree for JSON data', () => {
        const address = {
            location: 'foo',
            district: 'bar',
            coordinates: {
                lat: '0.365',
                long: '0.365',
            },
        };
        options.data = JSON.stringify(address);
        const tree = new DomTree(options, targetNode);
        tree.init();

        expect(targetNode).toMatchSnapshot();
    });

    it('should generate a tree in JSON format', () => {
        options.format = availableFormats.json;
        const tree = new DomTree(options, targetNode);
        tree.init();

        expect(targetNode).toMatchSnapshot();
    });
});
