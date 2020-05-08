function isParentNodeRoot(ele) {
    // it's safe to access parentNode.classList directly without
    // checking pareNode existence. Because dom-tree rendered into
    // user's target node
    return ele.parentNode.classList.contains('dtjs-root');
}

function isElementFolded(ele) {
    return ele.classList.contains('fold');
}

function isElementHasChildren(ele) {
    return ele.classList.contains('hc');
}

/* istanbul ignore next */
function addMoveDownClass(
    _isElementHasChildren,
    _isElementFolded,
    _isParentNodeRoot,
    firstChild,
    nextSibling,
    ele
) {
    if (
        _isElementHasChildren &&
        !_isElementFolded &&
        (!ele.classList.contains('dtjs-mu') || _isParentNodeRoot)
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

/* istanbul ignore next */
function addMoveUpClass(
    _isElementHasChildren,
    _isElementFolded,
    _isParentNodeRoot,
    lastChild,
    previousSibling,
    ele
) {
    if (
        _isElementHasChildren &&
        !_isElementFolded &&
        (!ele.classList.contains('dtjs-md') || _isParentNodeRoot)
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

function fold(ele) {
    kn.isElementHasChildren(ele) && !kn.isElementFolded(ele) && ele.classList.add('fold');
}

function collapse(ele) {
    kn.isElementHasChildren(ele) &&
        kn.isElementFolded(ele) &&
        ele.classList.remove('fold');
}

/* istanbul ignore next */
function moveUp(ele) {
    var _isParentNodeRoot = isParentNodeRoot(ele),
        _isElementFolded = isElementFolded(ele);

    // if root node is folded do nothing
    if (_isParentNodeRoot && _isElementFolded) return;

    var _isElementHasChildren = isElementHasChildren(ele),
        previousSibling = ele.previousSibling,
        lastChild = ele.querySelector('ul') && ele.querySelector('ul').lastChild,
        isEleHasMoveDownClass = ele.classList.contains('dtjs-md');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move up
    addMoveUpClass(
        _isElementHasChildren,
        _isElementFolded,
        _isParentNodeRoot,
        lastChild,
        previousSibling,
        ele
    );

    if (_isElementHasChildren && !_isElementFolded) {
        if (isEleHasMoveDownClass) {
            ele.classList.remove('dtjs-md');

            if (previousSibling) {
                previousSibling.className += ' dtjs-highlight';
            } else {
                _isParentNodeRoot
                    ? (lastChild.className += ' dtjs-highlight')
                    : (ele.offsetParent.className += ' dtjs-highlight dtjs-md');
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
            ? (previousSibling.className += ' dtjs-highlight')
            : (ele.offsetParent.className += ' dtjs-highlight dtjs-md');
    }
}

/* istanbul ignore next */
function moveDown(ele) {
    var _isParentNodeRoot = isParentNodeRoot(ele),
        _isElementFolded = isElementFolded(ele);

    // if root node is folded do nothing
    if (_isParentNodeRoot && _isElementFolded) return;

    var _isElementHasChildren = isElementHasChildren(ele),
        nextSibling = ele.nextSibling,
        firstChild = ele.querySelector('ul') && ele.querySelector('ul').firstChild,
        isEleHasMoveUpClass = ele.classList.contains('dtjs-mu');

    ele.classList.remove('dtjs-highlight');

    // we focused next element because of move down
    addMoveDownClass(
        _isElementHasChildren,
        _isElementFolded,
        _isParentNodeRoot,
        firstChild,
        nextSibling,
        ele
    );

    if (_isElementHasChildren && !_isElementFolded) {
        if (isEleHasMoveUpClass) {
            ele.classList.remove('dtjs-mu');

            if (nextSibling) {
                nextSibling.className += ' dtjs-highlight';
            } else {
                // reached to the root top then highlight it's first element
                _isParentNodeRoot
                    ? (firstChild.className += ' dtjs-highlight')
                    : (ele.offsetParent.className += ' dtjs-highlight dtjs-mu');
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
            ? (nextSibling.className += ' dtjs-highlight')
            : (ele.offsetParent.className += ' dtjs-highlight dtjs-mu');
    }
}

// why can't directly use module.exports = {...}.
// when i use module.exports i could not able to mock functions when testing.
var kn = {
    fold: fold,
    collapse: collapse,
    moveUp: moveUp,
    moveDown: moveDown,
    // following fn's exported only for testing purpose.
    // todo: may be we can use https://github.com/jhnns/rewire
    isElementHasChildren: isElementHasChildren,
    isElementFolded: isElementFolded,
    isParentNodeRoot: isParentNodeRoot,
    addMoveDownClass: addMoveDownClass,
};

module.exports = kn;
