# Changes to Custom Function Parser

### Unreleased (major)

- Rename `CustomFunction.function` to `CustomFunction.functionNode` (breaking).
- Fix a `RangeError` when serializing large preludes, types, or default values.
- Document that `false` indicates invalid input and that `onParseError` is limited to tokenizer and component value parsing errors.
- Add `FunctionParameter.parameterType` and `getParameterType()`.
- Remove `FunctionParameter.argumentType` and `getArgumentType()` (breaking).
- `getParameterType()` and `getReturnType()` return `*` when the type is omitted (breaking).
- `getDefaultValue()` returns `null` when a parameter has no default (breaking).
- Add `FunctionParameter.tokens()` and `FunctionParameter.toString()`.
- Export `parseFunctionParameters()`.
- Export `parseDashedFunctionArguments()`.
- Validate all `<declaration-value>` restrictions in default values and arguments.
- Share the `<declaration-value>` and `{}` unwrapping rules between parameters and arguments.
- Parse parameter lists in a single forward pass.
- Fix a trailing comma followed by whitespace or comments being included in a default value.
- Preserve `type(...)` wrappers in raw parameter tokens.
- Allow whitespace and comments after a trailing comma in parameter lists.
- Reject `{}` blocks that are mixed with other tokens in default values.
- Reject `--` as a parameter name.
- Support an empty default value (`--x:`).
- Reject `!` and `;` in default values.

### 1.0.0

_October 1, 2026_

- Initial version
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
