export function _isParentNodeRoot(ele) {
    return ele.parentNode.classList.contains('dtjs-root');
}

export function _isElementFolded(ele) {
    return ele.classList.contains('fold');
}

export function _isElementHasChildren(ele) {
    return ele.classList.contains('hc');
}

export function fold(ele) {
    _isElementHasChildren(ele) && !_isElementFolded(ele) && ele.classList.add('fold');
}

export function collapse(ele) {
    _isElementHasChildren(ele) && _isElementFolded(ele) && ele.classList.remove('fold');
}

export function _addMoveDownClass(
    isElementHasChildren, isElementFolded, isParentNodeRoot, firstChild,
    nextSibling, ele
) {
    if (
        isElementHasChildren &&
        !isElementFolded &&
        (!ele.classList.contains('dtjs-mu') || isParentNodeRoot)
    ) {
        if (firstChild && firstChild.classList.contains('hc')) {
            firstChild.className += ' dtjs-md';
        }
    } else {
        nextSibling &&
        nextSibling.classList.contains('hc') &&
        nextSibling.classList.add('dtjs-md');
    }
}

export function _addMoveUpClass(
    isElementHasChildren, isElementFolded, isParentNodeRoot, lastChild, previousSibling, ele
) {
    if (
        isElementHasChildren &&
        !isElementFolded &&
        (!ele.classList.contains('dtjs-md') || isParentNodeRoot)
    ) {
        if (lastChild && lastChild.classList.contains('hc')) {
            lastChild.className += ' dtjs-mu';
        }
    } else {
        previousSibling &&
        previousSibling.classList.contains('hc') &&
        previousSibling.classList.add('dtjs-mu');
    }
}

export function moveUp(ele) {
    var isParentNodeRoot = _isParentNodeRoot(ele),
        isElementFolded = _isElementFolded(ele);

    // if root node is folded do nothing
    if (isParentNodeRoot && isElementFolded) return;

    var isElementHasChildren = _isElementHasChildren(ele),
        previousSibling = ele.previousSibling,
        lastChild = ele.querySelector('ul') && ele.querySelector('ul').lastChild,
        isEleHasMoveDownClass = ele.classList.contains('dtjs-md');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move up
    _addMoveUpClass(
        isElementHasChildren, isElementFolded, isParentNodeRoot, lastChild, previousSibling, ele
    );

    if (isElementHasChildren && !isElementFolded) {
        if (isEleHasMoveDownClass) {
            ele.classList.remove('dtjs-md');

            if (previousSibling) {
                previousSibling.className += ' dtjs-highlight';
            } else {
                isParentNodeRoot
                    ? lastChild.className += ' dtjs-highlight'
                    : ele.offsetParent.className += ' dtjs-highlight dtjs-md';
            }
        } else {
            // highlight last child
            ele.classList.remove('dtjs-mu');
            lastChild.className += ' dtjs-highlight';
        }
    } else {
        ele.classList.contains('dtjs-mu') && ele.classList.remove('dtjs-mu');
        isEleHasMoveDownClass && ele.classList.remove('dtjs-md');

        previousSibling
            ? previousSibling.className += ' dtjs-highlight'
            : ele.offsetParent.className += ' dtjs-highlight dtjs-md';
    }
}

export function moveDown(ele) {
    var isParentNodeRoot = _isParentNodeRoot(ele),
        isElementFolded = _isElementFolded(ele);

    // if root node is folded do nothing
    if (isParentNodeRoot && isElementFolded) return;

    var isElementHasChildren = _isElementHasChildren(ele),
        nextSibling = ele.nextSibling,
        firstChild = ele.querySelector('ul') && ele.querySelector('ul').firstChild,
        isEleHasMoveUpClass = ele.classList.contains('dtjs-mu');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move down
    _addMoveDownClass(
        isElementHasChildren, isElementFolded, isParentNodeRoot, firstChild, nextSibling, ele
    );

    if (isElementHasChildren && !isElementFolded) {
        if (isEleHasMoveUpClass) {
            ele.classList.remove('dtjs-mu');

            if (nextSibling) {
                nextSibling.className += ' dtjs-highlight';
            } else {
                // reached to the root top then highlight it's first element
                isParentNodeRoot
                    ? firstChild.className += ' dtjs-highlight'
                    : ele.offsetParent.className += ' dtjs-highlight dtjs-mu';
            }
        } else {
            // highlight first child
            ele.classList.remove('dtjs-md');
            firstChild.className += ' dtjs-highlight';
        }
    } else {
        ele.classList.contains('dtjs-md') && ele.classList.remove('dtjs-md');
        isEleHasMoveUpClass && ele.classList.remove('dtjs-mu');
        nextSibling
            ? nextSibling.className += ' dtjs-highlight'
            : ele.offsetParent.className += ' dtjs-highlight dtjs-mu';
    }
}
