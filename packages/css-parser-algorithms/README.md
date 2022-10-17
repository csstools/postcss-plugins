# CSS Parser Algorithms

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/css-parser-algorithms.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

Implemented from : https://www.w3.org/TR/2021/CRD-css-syntax-3-20211224/

## Usage

Add [CSS Parser Algorithms] to your project:

```bash
npm install postcss @csstools/css-parser-algorithms --save-dev
```

[CSS Parser Algorithms] only accepts tokenized CSS.
It must be used together with `@csstools/css-tokenizer`.


```js
import { tokenizer, TokenType } from '@csstools/css-tokenizer';
import { parseComponentValue } from '@csstools/css-parser-algorithms';

const myCSS =  `@media only screen and (min-width: 768rem) {
	.foo {
		content: 'Some content!' !important;
	}
}
`;

const t = tokenizer({
	css: myCSS,
});

const tokens = [];

{
	while (!t.endOfFile()) {
		tokens.push(t.nextToken());
	}

	tokens.push(t.nextToken()); // EOF-token
}

const options = {
	onParseError: ((err) => {
		throw new Error(JSON.stringify(err));
	}),
};

const result = parseComponentValue(tokens, options);

console.log(result);
```

### Available functions

- [`parseComponentValue`](https://www.w3.org/TR/css-syntax-3/#parse-component-value)
- [`parseListOfComponentValues`](https://www.w3.org/TR/css-syntax-3/#parse-list-of-component-values)
- [`parseCommaSeparatedListOfComponentValues`](https://www.w3.org/TR/css-syntax-3/#parse-comma-separated-list-of-component-values)

### Options

```ts
{
	onParseError?: (error: ParserError) => void
}
```

#### `onParseError`

The parser algorithms are forgiving and won't stop when a parse error is encountered.
Parse errors also aren't tokens.

To receive parsing error information you can set a callback.

Parser errors will try to inform you about the point in the parsing logic the error happened.
This tells you the kind of error.

`start` and `end` are the location in your CSS source code.

`UnclosedSimpleBlockNode` and `UnclosedFunctionNode` entries will be added to the output.
This allows you to recover from errors and/or show warnings.

## Goals and non-goals

Things this package aims to be:
- specification compliant CSS parser
- a reliable low level package to be used in CSS sub-grammars

What it is not:
- opinionated
- fast
- small
- a replacement for PostCSS (PostCSS is fast and also an ecosystem)

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/css-parser-algorithms

[CSS Parser Algorithms]: https://github.com/csstools/postcss-plugins/tree/main/packages/css-parser
