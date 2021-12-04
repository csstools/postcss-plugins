# PostCSS Base Plugin [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

```ts
import plugin from '@csstools/postcss-base-plugin';
import { cli, helpTextLogger } from '@csstools/base-cli';

cli(
	plugin,
	['color', 'another_option'],
	helpTextLogger(
		'postcss-base-plugin-cli',
		'Base Plugin',
		'An example plugin CLI',
		{
			color: 'A CSS color',
			another_option: true,
		},
	),
);
```

[postcss]: https://github.com/postcss/postcss
