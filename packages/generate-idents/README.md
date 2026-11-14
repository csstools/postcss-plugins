# Generate Idents [<img src="https://postcss.github.io/postcss/logo.svg" alt="for PostCSS" width="90" height="90" align="right">]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/generate-idents.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

Generate stable, collision free CSS identifiers.

## API

[Read the API docs](./docs/generate-idents.md)

## Usage

Add [Generate Idents] to your project:

```bash
npm install @csstools/generate-idents --save-dev
```

```ts
import { generatedName } from '@csstools/generate-idents';

generatedName('p', 'src/a.css', '0');
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/generate-idents

[Generate Idents]: https://github.com/csstools/postcss-plugins/tree/main/packages/generate-idents
