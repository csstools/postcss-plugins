# Custom Function Parser <img src="https://cssdb.org/images/css.svg" alt="for CSS" width="90" height="90" align="right">

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/custom-function-parser.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

Implemented from : https://drafts.csswg.org/css-mixins-1/

## Usage

Add [Custom Function Parser] to your project:

```bash
npm install @csstools/custom-function-parser @csstools/css-parser-algorithms @csstools/css-tokenizer --save-dev
```

[Custom Function Parser] depends on our CSS tokenizer and parser algorithms.
It must be used together with `@csstools/css-tokenizer` and `@csstools/css-parser-algorithms`.

```ts
import { parse } from '@csstools/custom-function-parser';

const customFunction = parse('--foo(--bar <length>: 1px) returns <length>');
```

- `parse()` parses a `@function` prelude.
- `parseFunctionParameters()` parses a `@mixin` or `@function` parameter list.
- `parseDashedFunctionArguments()` parses the arguments of a `<dashed-function>` call.

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/custom-function-parser

[Custom Function Parser]: https://github.com/csstools/postcss-plugins/tree/main/packages/custom-function-parser
