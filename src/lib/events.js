const { classNames } = require('../config');
const navigation = require('./navigation');

function toggleExpand(event) {
    /* istanbul ignore else */
    if (event.target && event.target.className === classNames.expandable) {
        event.target.parentNode.classList.toggle(classNames.fold);
    }
}

function removeHighlight() {
    // `this` will refer to the element which detected the event.
    const highlightedEle = this.querySelector(
        `.${classNames.root} .${classNames.highlight}`
    );

    /* istanbul ignore else */
    if (highlightedEle) {
        // IE-11 does not support passing multiple arguments to classList.remove method
        highlightedEle.classList.remove(classNames.highlight);
        highlightedEle.classList.remove(classNames.moveDown);
        highlightedEle.classList.remove(classNames.moveUp);
    }
}

function handleKeyboardNavigation(event) {
    const keyCode = event.keyCode,
        highlightedEle = this.querySelector(`.${classNames.highlight}`);

    if (keyCode >= 37 && keyCode <= 40) {
        event.preventDefault(); // prevent horizontal, vertical scrolling

        if (!highlightedEle) {
            // highlight tree's first child & root arrow node
            this.firstChild.className += ` ${classNames.highlight} ${
                classNames.moveDown
            }`;
            return;
        }
    }

    switch (keyCode) {
        case 40:
            navigation.moveDown(highlightedEle);
            break;
        case 38:
            navigation.moveUp(highlightedEle);
            break;
        case 39:
            navigation.collapse(highlightedEle);
            break;
        case 37:
            navigation.fold(highlightedEle);
            break;
    }
}

module.exports = {
    toggleExpand,
    removeHighlight,
    handleKeyboardNavigation,
};
