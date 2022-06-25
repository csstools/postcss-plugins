<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you use `@layer` following the [Cascade Layers Specification]. For more information on layers, checkout [A Complete Guide to CSS Cascade Layers] by Miriam Suzanne.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

## How it works

[PostCSS Cascade Layers] creates "layers" of specificity.

It applies extra specificity on all your styles based on :
- the most specific selector found
- the order in which layers are defined

```css
@layer A, B;

@layer B {
	.a-less-specific-selector {
		/* styles */
	}
}

@layer A {
	#something #very-specific {
		/* styles */
	}
}

@layer C {
	.a-less-specific-selector {
		/* styles */
	}
}
```

most specific selector :
- `#something #very-specific`
- `[2, 0, 0]`
- `2 + 1` -> `3` to ensure there is no overlap

the order in which layers are defined :
- `A`
- `B`
- `C`

| layer | previous adjustment | specificity adjustment | selector |
| ------ | ------ | ----------- | --- |
| `A` | `0` | `0 + 0 = 0` | N/A |
| `B` | `0` | `0 + 3 = 3` | `:not(#/#):not(#/#):not(#/#)` |
| `C` | `3` | `3 + 3 = 6` | `:not(#/#):not(#/#):not(#/#):not(#/#):not(#/#):not(#/#)` |

This approach lets more important (later) layers always override less important (earlier) layers.<br>
And layers have enough room internally so that each selector works and overrides as expected.

More layers with more specificity will cause longer `:not(...)` selectors to be generated.

⚠️ For this to work the plugin needs to analyze your entire stylesheet at once.<br>
If you have different assets that are unaware of each other it will not work correctly as the analysis will be incorrect.

<usage>

<envSupport>

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

### onConditionalRulesChangingLayerOrder

The `onConditionalRulesChangingLayerOrder` option enables warnings if layers are declared in multiple different orders in conditional rules.
Transforming these layers correctly for older browsers is not possible in this plugin.

Defaults to `warn`

```js
<exportName>({ onConditionalRulesChangingLayerOrder: 'warn' }) // 'warn' | false
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

### onImportLayerRule

The `@import` at-rule can also be used with cascade layers, specifically to create a new layer like so: 
```css
@import 'theme.css' layer(utilities);
```
If your CSS uses `@import` with layers, you will also need the [postcss-import] plugin. This plugin alone will not handle the `@import` at-rule.  

This plugin will warn you when it detects that [postcss-import] did not transform`@import` at-rules.

```js
<exportName>({ onImportLayerRule: 'warn' }) // 'warn' | false
```

### Contributors
The contributors to this plugin were [Olu Niyi-Awosusi] and [Sana Javed] from [Oddbird] and Romain Menke.

<linkList>
[Cascade Layers Specification]: <specUrl>
[A Complete Guide to CSS Cascade Layers]: https://css-tricks.com/css-cascade-layers/
[Olu Niyi-Awosusi]: https://github.com/oluoluoxenfree
[Sana Javed]: https://github.com/sanajaved7
[Oddbird]: https://github.com/oddbird
[postcss-import]: https://github.com/postcss/postcss-import
