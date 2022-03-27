# List of features in PostCSS Preset Env

The `ID` listed is the key for PostCSS Preset Env configuration in your project.

<featuresTable>

-------

Manually enable a feature :

```js
postcssPresetEnv({
	features: {
		'<ID>': true
	}
})
```

Or disable one :

```js
postcssPresetEnv({
	features: {
		'<ID>': false
	}
})
```

Set feature options :

```js
postcssPresetEnv({
	features: {
		'<ID>': {
			preserve: false
		}
	}
})
```
