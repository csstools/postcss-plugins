<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <env-support> -->
<!-- <link-list> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets use `@layer` following the [Cascade Layers Specification].

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<env-support>

## Options

### onRevertLayerKeyword

The `onRevertLayerKeyword` option enables warnings if `revert-layer` is used.
Transforming `revert-layer` for older browsers is not possible in this plugin.

Defaults to `warn`

```js
<exportName>({ onRevertLayerKeyword: 'warn' }) // 'warn' | false
```

```pcss
/* [postcss-cascade-layers]: handling "revert-layer" is unsupported by this plugin and will cause style differences between browser versions. */
@layer {
	.foo {
		color: revert-layer;
	}
}
```

### onMixedLayerOrder

The `onMixedLayerOrder` option enables warnings if layers are declared in multiple different orders in conditional rules.
Transforming these layers correctly for older browsers is not possible in this plugin.

Defaults to `warn`

```js
<exportName>({ onMixedLayerOrder: 'warn' }) // 'warn' | false
```

```pcss
/* [postcss-cascade-layers]: handling different layer orders in conditional rules is unsupported by this plugin and will cause style differences between browser versions. */
@media (min-width: 10px) {
	@layer B {
		.foo {
			color: red;
		}
	}
}

@layer A {
	.foo {
		color: pink;
	}
}

@layer B {
	.foo {
		color: red;
	}
}
```

<!-- TODO : Add a reference to oddbird for doing all the heavy lifting -->

<link-list>
[Cascade Layers Specification]: <specUrl>
