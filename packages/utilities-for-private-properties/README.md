# Utilities for Private Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="for PostCSS" width="90" height="90" align="right">]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/utilities-for-private-properties.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

Transpile `@private` rules and private custom property references.

## API

[Read the API docs](./docs/utilities-for-private-properties.md)

## Usage

Add [Utilities for Private Properties] to your project:

```bash
npm install @csstools/utilities-for-private-properties @csstools/css-parser-algorithms @csstools/css-tokenizer postcss --save-dev
```

```ts
import { createPrivatePropertyTranspiler } from '@csstools/utilities-for-private-properties';

const transpiler = createPrivatePropertyTranspiler({ namespace: 'p' });

const registrations = transpiler.transpile(root.nodes);
root.append(...registrations);
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/utilities-for-private-properties

[Utilities for Private Properties]: https://github.com/csstools/postcss-plugins/tree/main/packages/utilities-for-private-properties
