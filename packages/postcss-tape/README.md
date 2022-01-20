# PostCSS Tape for csstools/postcss-plugins

_Internal package_

See [.tape.mjs](https://github.com/csstools/postcss-plugins/blob/main/plugins/postcss-base-plugin/.tape.mjs) in the base plugin for a minimal example.

```js
import postcssTape from '../../packages/postcss-tape/dist/index.mjs';
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

Browse the source code and tests here or see tests in plugins for more usage details.

------------

## After node 20 is released do a find/replace to migrate fully to workspaces :

- `import postcssTape from '../../packages/postcss-tape/dist/index.mjs';`
- `import postcssTape from '@csstools/postcss-tape';`

Then add `@csstools/postcss-tape` the each `package.json` as a dev dependency.
