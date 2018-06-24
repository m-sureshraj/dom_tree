const kbn = require('../src/js/util/keyboard_navigation');

describe('Test keyboard navigation functions', () => {
    describe('isElementHasChildren:', () => {
        it('should return true if element has children else false', () => {
            const ele = document.createElement('div');

            expect(kbn.isElementHasChildren(ele)).toBeFalsy();

            ele.className = 'hc';

            expect(kbn.isElementHasChildren(ele)).toBeTruthy();
        });
    });

    describe('isElementFolded:', () => {
        it('should return true if element is folded else false', () => {
            const ele = document.createElement('div');

            expect(kbn.isElementFolded(ele)).toBeFalsy();

            ele.className = 'fold';

            expect(kbn.isElementFolded(ele)).toBeTruthy();
        });
    });

    describe('isParentNodeRoot:', () => {
        it('should return true if parent node is a root else false', () => {
            const parentNode = document.createElement('div');
            const childNode = document.createElement('span');
            parentNode.appendChild(childNode);

            expect(kbn.isParentNodeRoot(childNode)).toBeFalsy();

            parentNode.className = 'dtjs-root';

            expect(kbn.isParentNodeRoot(childNode)).toBeTruthy();
        });
    });

    describe('fold:', () => {
        document.body.innerHTML = '<div><ul></ul></div>';
        const list = document.querySelector('ul');

        it('should only fold the list if element has children in it', () => {
            const isElementHasChildrenMock = jest.spyOn(kbn, 'isElementHasChildren');
            kbn.fold(list);

            expect(isElementHasChildrenMock).toHaveBeenCalled();
            expect(isElementHasChildrenMock).toHaveBeenCalledWith(list);
        });

        it('should only fold the list if it is collapsed', () => {
            list.className = 'hc fold';
            const isElementFoldedMock = jest.spyOn(kbn, 'isElementFolded');
            kbn.fold(list);

            expect(isElementFoldedMock).toHaveBeenCalled();
            expect(isElementFoldedMock(list)).toBeTruthy();
        });

        it('should add a class called `fold` if element not folded', () => {
            list.className = 'hc';
            kbn.fold(list);

            expect(list.classList.contains('fold')).toBeTruthy();
        });
    });

    describe('collapse:', () => {
        document.body.innerHTML = '<div><ul></ul></div>';
        const list = document.querySelector('ul');

        it('should only collapse the list if element has children in it', () => {
            const isElementHasChildrenMock = jest.spyOn(kbn, 'isElementHasChildren');
            kbn.collapse(list);

            expect(isElementHasChildrenMock).toHaveBeenCalled();
            expect(isElementHasChildrenMock).toHaveBeenCalledWith(list);
        });

        it('should only collapse the list if it is folded', () => {
            list.className = 'hc';
            const isElementFoldedMock = jest.spyOn(kbn, 'isElementFolded');
            kbn.collapse(list);

            expect(isElementFoldedMock).toHaveBeenCalled();
            expect(isElementFoldedMock(list)).toBeFalsy();
        });

        it('should remove the class called `fold` if element collapsed', () => {
            list.className = 'hc fold';
            kbn.collapse(list);

            expect(list.classList.contains('fold')).toBeFalsy();
        });
    });

    // describe('addMoveDownClass:', () => {
    //     let targetEle, isElementHasChildren, nextSibling, firstChild,
    //       isParentNodeRoot, isElementFolded;
    //
    //     beforeEach(() => {
    //         document.body.innerHTML = sampleTree();
    //     });
    //
    //     it('should add `dtjs-md` class to the target element first child', () => {
    //         targetEle = document.querySelector('.dtjs-root > li');
    //         isParentNodeRoot = kbn.isParentNodeRoot(targetEle);
    //         isElementFolded = kbn.isElementFolded(targetEle);
    //         isElementHasChildren = kbn.isElementHasChildren(targetEle);
    //         nextSibling = targetEle.nextSibling;
    //         firstChild = targetEle.querySelector('ul') && targetEle.querySelector('ul').firstChild;
    //
    //         kbn.addMoveDownClass(
    //           isElementHasChildren, isElementFolded, isParentNodeRoot,
    //           firstChild, nextSibling, targetEle
    //         );
    //
    //         expect(firstChild.classList.contains('dtjs-md')).toBeTruthy();
    //     });
    //
    //     fit('should add `dtjs-md` class to the next sibling', () => {
    //         targetEle = document.querySelector('.next-sibling-target');
    //         targetEle.className += ' dtjs-mu';
    //         isParentNodeRoot = kbn.isParentNodeRoot(targetEle);
    //         isElementFolded = kbn.isElementFolded(targetEle);
    //         isElementHasChildren = kbn.isElementHasChildren(targetEle);
    //         nextSibling = targetEle.nextSibling;
    //         firstChild = targetEle.querySelector('ul') && targetEle.querySelector('ul').firstChild;
    //
    //         kbn.addMoveDownClass(
    //           isElementHasChildren, isElementFolded, isParentNodeRoot,
    //           firstChild, nextSibling, targetEle
    //         );
    //
    //         expect(nextSibling.classList.contains('dtjs-md')).toBeTruthy();
    //     });
    // });
});
