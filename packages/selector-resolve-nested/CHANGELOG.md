# Changes to Selector Resolve Nested

### 3.1.0

_June 6, 2025_

- Add `ignoreImplicitNesting` option to `resolveNestedSelector`

### 3.0.0

_October 23, 2024_

- Make sorting compound selectors forwards compatible with potential future changes in `postcss-selector-parser`
- Updated: `postcss-selector-parser`

### 2.0.0

_August 3, 2024_

- Updated: Support for Node v18+ (major).

## 1.1.0

_February 1, 2024_

- Add `flattenNestedSelector` function to support more kinds of static analysis for nested selectors.

## 1.0.3

_January 25, 2024_

- Correctly add child nodes to newly constructed `Selector` and `Root` AST nodes.

## 1.0.2

_January 22, 2024_

- Preserve extra/unknown fields on source objects of AST nodes

### 1.0.1

_January 21, 2024_

- Improve source index resolution

### 1.0.0

_January 21, 2024_

- Initial version
