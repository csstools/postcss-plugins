# Changes to Custom Function Parser

### Unreleased (minor)

- Export `parseFunctionParameters()`.
- Export `parseDashedFunctionArguments()`.
- Share the `<declaration-value>` and `{}` unwrapping rules between parameters and arguments.
- Reject `--` as a parameter name.
- Support an empty default value (`--x:`).
- Reject `!` and `;` in default values.

### 1.0.0

_October 1, 2026_

- Initial version
- Updated [`@csstools/css-parser-algorithms`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms) to [`4.0.2`](https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser-algorithms/CHANGELOG.md#402) (patch)
