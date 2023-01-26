# Changes to CSS Parser Algorithms

### Unreleased (patch)

- Improve `types` declaration in `package.json`

### 2.0.0 (January 19, 2023)

- Fix: Removes `UnclosedFunctionNode` and `UnclosedSimpleBlockNode`. (breaking)
- Change the `ParseError` interface, this is now a subclass of `Error` (breaking)
- Change `nameTokenValue` in `FunctionNode` to `getName` (breaking)
- Fix: Do not discard empty items in comma separated lists.

### 1.0.0 (November 14, 2022)

- Initial version
