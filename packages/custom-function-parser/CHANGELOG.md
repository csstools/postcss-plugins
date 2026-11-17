# Changes to Custom Function Parser

### 2.0.0

_November 17, 2026_

- Omitted types are `*` for `getParameterType()` and `getReturnType()` (breaking).
- Rename `CustomFunction.function` to `CustomFunction.functionNode` (breaking).
- Replace `FunctionParameter.argumentType`/`getArgumentType()` with `parameterType`/`getParameterType()` (breaking).
- Return `null` from `getDefaultValue()` when a parameter has no default (breaking).
- Add `FunctionParameter.tokens()`/`toString()` and export `parseFunctionParameters()`/`parseDashedFunctionArguments()`.
- Document that `false` signals invalid input.
- Enforce `<declaration-value>` restrictions and preserve `type(...)`/`{}` wrappers in tokens.
- Fix a `RangeError` and improve performance for large token lists.
- Reject `--` as a parameter name.
- Support `--foo(,)`, empty defaults and trailing commas, and only trim whitespace from arguments and defaults.
- Updated [`@csstools/css-tokenizer`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-tokenizer/CHANGELOG.md#403) (patch)
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.3`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#403) (patch)

### 1.0.0

_October 1, 2026_

- Initial version
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
