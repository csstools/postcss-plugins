# PostCSS Tape for csstools/postcss-plugins

See [`test/_tape.mjs`](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-base-plugin/test/_tape.mjs) in the base plugin for a minimal example.

Uses native `node:test` and `node:assert`.  
See [`test` documentation](https://nodejs.org/docs/latest/api/test.html) for more usage details.

```js
import { postcssTape } from '@csstools/postcss-tape';
import plugin from '@csstools/postcss-base-plugin';

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
	example: {
		message: "minimal example",
	},
});
```

Browse the [source code and tests here](https://github.com/csstools/postcss-plugins/tree/main/packages/postcss-tape) or see [tests in plugins](https://github.com/csstools/postcss-plugins/tree/main/plugins) for more usage details.

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

Set an env variable `REWRITE_EXPECTS` to `true` to update all `expect` files.

example :

```json
	"scripts": {
		"test": "node --test",
		"test:rewrite-expects": "REWRITE_EXPECTS=true node --test"
	},
```
