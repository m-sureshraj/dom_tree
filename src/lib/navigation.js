const { classNames } = require('../config');

// todo: Check whether `offsetParent` replaceable with `parentNode`
// JsDOM does not support `offsetParent`

function isParentNodeRoot(ele) {
    return ele.parentNode.classList.contains(classNames.root);
}

function isElementFolded(ele) {
    return ele.classList.contains(classNames.fold);
}

function isElementHasChildren(ele) {
    return ele.classList.contains(classNames.hasChildren);
}

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
        (!ele.classList.contains(classNames.moveUp) || _isParentNodeRoot)
    ) {
        if (firstChild && firstChild.classList.contains(classNames.hasChildren)) {
            firstChild.className += ` ${classNames.moveDown}`;
        }
    } else {
        nextSibling &&
            nextSibling.classList.contains(classNames.hasChildren) &&
            nextSibling.classList.add(classNames.moveDown);
    }
}

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
        (!ele.classList.contains(classNames.moveDown) || _isParentNodeRoot)
    ) {
        if (lastChild && lastChild.classList.contains(classNames.hasChildren)) {
            lastChild.className += ` ${classNames.moveUp}`;
        }
    } else {
        previousSibling &&
            previousSibling.classList.contains(classNames.hasChildren) &&
            previousSibling.classList.add(classNames.moveUp);
    }
}

function fold(ele) {
    isElementHasChildren(ele) &&
        !isElementFolded(ele) &&
        ele.classList.add(classNames.fold);
}

function collapse(ele) {
    isElementHasChildren(ele) &&
        isElementFolded(ele) &&
        ele.classList.remove(classNames.fold);
}

function moveUp(ele) {
    const _isParentNodeRoot = isParentNodeRoot(ele),
        _isElementFolded = isElementFolded(ele);

    // if root node is folded do nothing
    if (_isParentNodeRoot && _isElementFolded) return;

    const _isElementHasChildren = isElementHasChildren(ele),
        previousSibling = ele.previousSibling,
        lastChild = ele.querySelector('ul') && ele.querySelector('ul').lastChild,
        isEleHasMoveDownClass = ele.classList.contains(classNames.moveDown);

    ele.classList.remove(classNames.highlight);

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
            ele.classList.remove(classNames.moveDown);

            if (previousSibling) {
                previousSibling.className += ` ${classNames.highlight}`;
            } else {
                _isParentNodeRoot
                    ? (lastChild.className += ` ${classNames.highlight}`)
                    : (ele.offsetParent.className += ` ${classNames.highlight} ${
                          classNames.moveDown
                      }`);
            }
        } else {
            // highlight last child
            ele.classList.remove(classNames.moveUp);
            lastChild.className += ` ${classNames.highlight}`;
        }
    } else {
        ele.classList.contains(classNames.moveUp) &&
            ele.classList.remove(classNames.moveUp);
        isEleHasMoveDownClass && ele.classList.remove(classNames.moveDown);

        previousSibling
            ? (previousSibling.className += ` ${classNames.highlight}`)
            : (ele.offsetParent.className += ` ${classNames.highlight} ${
                  classNames.moveDown
              }`);
    }
}

function moveDown(ele) {
    const _isParentNodeRoot = isParentNodeRoot(ele),
        _isElementFolded = isElementFolded(ele);

    // if root node is folded do nothing
    if (_isParentNodeRoot && _isElementFolded) return;

    const _isElementHasChildren = isElementHasChildren(ele),
        nextSibling = ele.nextSibling,
        firstChild = ele.querySelector('ul') && ele.querySelector('ul').firstChild,
        isEleHasMoveUpClass = ele.classList.contains(classNames.moveUp);

    ele.classList.remove(classNames.highlight);

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
            ele.classList.remove(classNames.moveUp);

            if (nextSibling) {
                nextSibling.className += ` ${classNames.highlight}`;
            } else {
                // reached to the root top then highlight it's first element
                _isParentNodeRoot
                    ? (firstChild.className += ` ${classNames.highlight}`)
                    : (ele.offsetParent.className += ` ${classNames.highlight} ${
                          classNames.moveUp
                      }`);
            }
        } else {
            // highlight first child
            ele.classList.remove(classNames.moveDown);
            firstChild.className += ` ${classNames.highlight}`;
        }
    } else {
        ele.classList.contains(classNames.moveDown) &&
            ele.classList.remove(classNames.moveDown);
        isEleHasMoveUpClass && ele.classList.remove(classNames.moveUp);
        nextSibling
            ? (nextSibling.className += ` ${classNames.highlight}`)
            : (ele.offsetParent.className += ` ${classNames.highlight} ${
                  classNames.moveUp
              }`);
    }
}

module.exports = {
    fold,
    collapse,
    moveUp,
    moveDown,
};
