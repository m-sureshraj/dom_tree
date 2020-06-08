# dom_tree
![Travis (.org)](https://img.shields.io/travis/m-sureshraj/dom_tree)

A small JavaScript library (with ZERO dependencies) to convert object, array, and JSON into an interactive HTML tree view. The dom_tree is fully [configurable](#options) and supports theming and keyboard navigation.

```javascript
// Convert following data
const data = {
    name: 'Mr. Foo',
    gender: 'Male',
    age: 99,
    isMarried: true,
    wife: null,
    children: ['bar', 'baz'],
    friends: undefined,
    location: {
        district: 'underground',
        zipcode: -100,
    },
};

// Into
```

![dom_tree in action](https://raw.githubusercontent.com/m-sureshraj/dom_tree/master/media/dom_tree.gif)

### Live Demo
[![Edit dom_tree playground](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/domtree-playground-m91hr?fontsize=14&hidenavigation=1&theme=dark)

## Installation
You can add dom_tree to your project via npm

```
> npm install --save @sureshraj/dom_tree
```
> Unfortunately, the package name `dom_tree` is not available on NPM. So it's published as a user scoped package with public access.

Or load it from [unpkg.com](https://unpkg.com/)

```html
<link rel="stylesheet" href="https://unpkg.com/@sureshraj/dom_tree/dist/css/dom_tree.min.css" />
<script src="https://unpkg.com/@sureshraj/dom_tree/dist/js/dom_tree.min.js"></script>
```

## Usage
* When using module bundlers

```javascript
// index.js
import DomTree from '@sureshraj/dom_tree';
import '@sureshraj/dom_tree/dist/css/dom_tree.min.css';

// DOM node to initialize the tree
const targetNode = document.querySelector('#app');

// data is the only required option
const options = { data: {} };

const dt = new DomTree(options, targetNode);
dt.init();
```

* With plain HTML

```html
<!-- index.html -->
<head>
    <link rel="stylesheet" href="https://unpkg.com/@sureshraj/dom_tree/dist/css/dom_tree.min.css" />
    <script src="https://unpkg.com/@sureshraj/dom_tree/dist/js/dom_tree.min.js"></script>
</head>

<body>
    <div id="app"></div>

    <script>
      const targetNode = document.querySelector("#app");
      const options = { data: {} };

      // Above script will add `DomTree` to the window scope
      const dt = new DomTree(options, targetNode);
      dt.init();
    </script>
</body>
```

## Options
| Option | Type | Required? | Default | Description |
| --- | --- | --- | --- | --- |
| data | `object` \| `array` \| `JSON` | required | - | coming soon |
| theme | `string` | optional | rose | Available themes are `rose`, `one-dark`, `chrome-light`, and `darcula`. |
| format | `string` | optional | object | Available formats are `object` and `json`. Use `json` to wrap property keys with double quotes.  |
| fold | `boolean` | optional | `false` | coming soon |
| separators | `boolean` | optional | `true` | Add comma separator after each property. |
| keyboardNavigation | `boolean` | optional | `false` | Use this option to enable/disable the keyboard navigation. |
| removeHighlightOnBlur | `boolean` | optional | `false` | coming soon |

## Methods
| Method | Params | Description |
| --- | --- | --- |
| init | - | coming soon |

## Todo
* Expose a method to update the initialized tree. [Issue](https://github.com/m-sureshraj/dom_tree/issues/22)

## license
MIT © [Sureshraj](https://github.com/m-sureshraj)
