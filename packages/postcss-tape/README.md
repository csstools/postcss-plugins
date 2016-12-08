# PostCSS Tape

Quickly test a PostCSS plugin.

1. Install this dependency to your project:

   ```sh
   npm install jonathantneal/postcss-tape
   ```

2. Add the `postcss-tape` task to your `package.json`:

   ```json
   {
      "scripts": {
        "tape": "postcss-tape"
      }
   }
   ```

3. Add tests to your `.tape.js` file:

   ```js
   module.exports = {
		'postcss-my-plugin': {
			'basic': {
				message: 'supports basic usage'
			}
		}
   };
   ```

That’s it! Now you can use the `tape` task:

```sh
npm run tape
```

## Options

Options may be passed through `package.json` using `postcssConfig`:

```json
{
	"postcssConfig": {
		"plugin": "path/to/plugin.js",
		"config": "path/to/.tape.js",
		"fixtures": "path/to/cssdir"
	}
}
```

Options may be passed through arguments:

```sh
postcss-tape --plugin=path/to/plugin.js --config=path/to/.tape.js
```

## Advanced usage

Overriding the `plugin#process` method in your plugin allows you to separate plugin options from process options. This is useful when testing plugins that need to work when no options are passed, or when testing plugins that need to use options that share the namespace of process options.

```js
// override plugin#process
module.exports.process = function (cssString, pluginOptions, processOptions) {
	return postcss([
		1 in arguments ? module.exports(pluginOptions) : module.exports()
	]).process(cssString, processOptions);
};
```
