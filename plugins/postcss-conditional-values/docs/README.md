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

[<humanReadableName>] lets you easily apply space toggle hacks with some syntactic sugar.

This plugin adds a non-standard function : `csstools-if( else )` which acts as a ternary operator.

`csstools-if(--a-variable <value-when-true> else <value-when-false>)`

You control the outcome by setting `--a-variable` to `true` and `false`.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

For more information on how the trick works, you can read more on these articles:

- [The CSS Custom Property Toggle Trick](https://css-tricks.com/the-css-custom-property-toggle-trick/)
- [The -​-var: ; hack to toggle multiple values with one custom property](https://lea.verou.me/2020/10/the-var-space-hack-to-toggle-multiple-values-with-one-custom-property/)

<usage>

<envSupport>

## Options

### functionName

The `functionName` option allows you to set a custom alias for `csstools-if`.

```js
<exportName>({ functionName: 'if' })
```

```pcss
<example-custom-function-name.css>

/* becomes */

<example-custom-function-name.expect.css>
```

## Syntax

### `csstools-if else` function

The `csstools-if else` function is used to declare which values must be used when a condition is true or false.

```pcss
color: csstools-if(--a-condition yellow else red);
```

```
csstools-if(<custom-property-name> <declaration-value> else <declaration-value>);
```

### `true` and `false` keywords

The `true` and `false` keywords are syntactic sugar for `initial` and `<space>`.

```pcss
--a-condition: true;

/* becomes */

--a-condition: initial;
```

```pcss
--a-condition: false;

/* becomes */

--a-condition:  ;
```

You can manually toggle the condition with `initial` and `<space>`.
This makes it possible to control the outcome of conditions with javascript, inline styles, ...

<linkList>
