# PostCSS Tape for csstools/postcss-plugins

See [.tape.mjs](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-base-plugin/.tape.mjs) in the base plugin for a minimal example.

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

## Quickly update all `expect.css` files.

Set an env variable `REWRITE_EXPECTS` to `true` to update all `expect` files.

example :

```json
	"scripts": {
		"test": "node .tape.mjs ",
		"test:rewrite-expects": "REWRITE_EXPECTS=true node .tape.mjs"
	},
```
