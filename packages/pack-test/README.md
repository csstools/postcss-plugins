# Pack Test

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/pack-test.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url]

Verify that the published contents of your node package will pass a basic smoke test.  
This tests creates a `pack` of your node modules just like `npm publish` and tries to import it.

> Why do static analysis when you can brute force it?

## API

[Read the API docs](./docs/pack-test.md)

## Usage

```bash
npm install @csstools/pack-test --save-dev
```

```js
import { testPack } from '@csstools/pack-test';

await testPack('@csstools/pack-test');
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[npm-url]: https://www.npmjs.com/package/@csstools/pack-test
