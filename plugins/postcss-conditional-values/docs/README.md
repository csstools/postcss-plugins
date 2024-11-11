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
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you easily apply space toggle hacks with some syntactic sugar.

This plugin adds a non-standard function : `csstools-if( else )` which acts as a ternary operator.

`csstools-if(--a-variable <value-when-true> else <value-when-false>)`

You control the outcome by setting `--a-variable` to `true` and `false`.

```css
<example.css>

/* becomes */

<example.expect.css>
```

For more information on how the trick works, you can read more on these articles:

- [The CSS Custom Property Toggle Trick](https://css-tricks.com/the-css-custom-property-toggle-trick/)
- [The -​-var: ; hack to toggle multiple values with one custom property](https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/)

<parallelBuildsNotice>

<usage>

<envSupport>

## Options

### functionName

The `functionName` option allows you to set a custom alias for `csstools-if`.

```js
<exportName>({ functionName: 'if' })
```

```css
<example-custom-function-name.css>

/* becomes */

<example-custom-function-name.expect.css>
```

## Syntax

### `csstools-if else` function

The `csstools-if else` function is used to declare which values must be used when a condition is true or false.

```css
color: csstools-if(--a-condition yellow else red);
```

```
csstools-if(<custom-property-name> <declaration-value> else <declaration-value>);
```

#### [Stylelint](https://stylelint.io/user-guide/rules/declaration-property-value-no-unknown/#propertiessyntax--property-syntax-)

Stylelint is able to check for unknown property values.
Setting the correct configuration for this rule makes it possible to check even non-standard syntax.

```js
	// Disallow unknown values for properties within declarations.
	'declaration-property-value-no-unknown': [
		true,
		{
			propertiesSyntax: {
				color: '| csstools-if( <custom-property-name> <\'color\'> else <\'color\'> )',
				'background-color': '| csstools-if( <custom-property-name> <\'background-color\'> else <\'background-color\'> )',
				// ... more properties ...
			},
		},
	],
```

### `true` and `false` keywords

The `true` and `false` keywords are syntactic sugar for `initial` and `<space>`.

```css
--a-condition: true;

/* becomes */

--a-condition: initial;
```

```css
--a-condition: false;

/* becomes */

--a-condition:  ;
```

You can manually toggle the condition with `initial` and `<space>`.
This makes it possible to control the outcome of conditions with javascript, inline styles, ...

<linkList>
