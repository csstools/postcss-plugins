# Changes to Custom Function Parser

### Unreleased (major)

- Rename `CustomFunction.function` to `CustomFunction.functionNode` (breaking).
- Replace `FunctionParameter.argumentType`/`getArgumentType()` with `parameterType`/`getParameterType()` (breaking).
- Omitted types are `*` for `getParameterType()` and `getReturnType()` (breaking).
- `getDefaultValue()` returns `null` when a parameter has no default (breaking).
- Add `FunctionParameter.tokens()` and `FunctionParameter.toString()`.
- Export `parseFunctionParameters()` and `parseDashedFunctionArguments()`.
- Enforce `<declaration-value>` restrictions in default values and arguments.
- Preserve `type(...)` wrappers in `parameterType` and `{}` wrappers in `defaultValue` tokens.
- Reject `--` as a parameter name.
- Support empty default values and trailing commas with surrounding whitespace or comments.
- Fix a `RangeError` when serializing large token lists.
- Improve parameter parsing and `getDefaultValue()` performance.
- Document that `false` signals invalid input.

### 1.0.0

_October 1, 2026_

- Initial version
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
