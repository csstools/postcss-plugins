# Experimental plugins

## Why

When we create plugins for very early specifications we often make the wrong assumptions.
This does not mean your CSS won't work today but we aim to match the specification as closely as possible.

To resolve these issues we want to iterate quickly along side browser vendors.
We can do this on a git branch but that means we can't give you a working example.

The experimental plugins are intended to expose ongoing work to users for feedback.


## Limits

The scope of the experimental plugins is limited in time.
Once the implementation is stable in browsers we move over the final version to the real plugin.

At this time the experimental plugin will be deprecated.
What then happens with the plugin might differ from case to case.
But you should remove it as soon as possible to avoid surprises.

We might need another experimental track for a different issue in the same plugin.
This means the logic of the experimental plugin will change.

It's best to think of these as debugging tools and not as production ready plugin.

## PostCSS Preset Env

When you use `postcss-preset-env` and want to combine with an experimental plugin you should disable the regular plugin.

The order can be important but this will be detailed in the experimental plugin docs.

```js
plugins: [
	postcssPresetEnv({
		features: {
			'css-has-pseudo': false
		}
	}),
	cssHasPseudoExperimental(),
]
```
