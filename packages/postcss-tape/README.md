# PostCSS Tape [<img src="https://postcss.github.io/postcss/logo.svg" alt="for PostCSS" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-tape.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg?branch=main" height="20">][cli-url]

## Features

- compare the output of your PostCSS plugin with the expected output
- test that the output can be re-parsed by PostCSS
- test Sourcemap validity
- test interop with other PostCSS plugins
- enforce [guidelines for PostCSS plugins](https://github.com/postcss/postcss/blob/main/docs/guidelines/plugin.md)
- test both latest `PostCSS` and an older minor version to ensure compatibility
- uses [`node:test`](https://nodejs.org/docs/latest/api/test.html) under the hood

## API

[Read the API docs](./docs/postcss-tape.md)

## Usage

See [`test/_tape.mjs`](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-base-plugin/test/_tape.mjs) in the base plugin for a minimal example.

1. Install this package as a dev dependency.

```bash
npm install @csstools/postcss-tape --save-dev
```

2. Create a `test` directory in your project.

3. Write some CSS that will be processed by your plugin.

```css
/* test/basic.css */
.foo {
	color: oklch(40% 0.268735435 34.568626);
}
```

4. Describe your test cases in a JavaScript file.

```js
/* test/_tape.mjs */
import { postcssTape } from '@csstools/postcss-tape';
import plugin from '<your plugin package name>';

postcssTape(plugin)({
	basic: {
		message: "supports basic usage",
	},
	'basic:color': {
		message: "supports { color: '<a color>' }",
		options: {
			color: 'purple'
		}
	},
});
```

5. Run the tests.

```sh
# See https://nodejs.org/docs/latest/api/test.html for more usage details.
node --test
```

```json
{
	"scripts": {
		"test": "node --test"
	}
}
```

Browse the [source code and tests here](https://github.com/csstools/postcss-plugins/tree/main/packages/postcss-tape) or see [tests in plugins](https://github.com/csstools/postcss-plugins/tree/main/plugins) for more usage details.

> [!NOTE]
> We use `test/_tape.mjs` for our tests, but you can use any file name you want.  
> We like to group things in a `test` directory and we use a leading underscore to sort it before the css files.

## File name format and test case naming

Test source files and test case names are related.  
The test case name is expected to be the relative file path with the `.css` extension removed.

Test variants (with different plugin options) are separated by a colon `:`.

All test files are expected to be in a `test` directory in the current working directory.

| test case name | file name | result file name | notes |
| --- | --- | --- | --- |
| `basic` | `test/basic.css` | `test/basic.result.css` | |
| `basic:color` | `test/basic.css` | `test/basic.color.result.css` | A variant test for `basic`. Everything after `:` is ignored. |
| `foo/bar` | `test/foo/bar.css` | `test/foo/bar.result.css` | A test file in a directory |

## `.gitignore`

We recommend adding `*.result.css` to your `.gitignore` file.  
This is not functionally required, but it will reduce noise in your git history.

## Quickly update all `expect.css` files.

Set env variable `REWRITE_EXPECTS` to `true` to update all `expect.css` files.

example :

```json
{
	"scripts": {
		"test": "node --test",
		"test:rewrite-expects": "REWRITE_EXPECTS=true node --test"
	}
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-tape
[postcss]: https://github.com/postcss/postcss
