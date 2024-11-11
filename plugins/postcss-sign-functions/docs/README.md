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

[<humanReadableName>] lets you use the `sign` and `abs` functions, following the [CSS Values 4] specification.

```css
<example.css>

/* becomes */

<example.expect.css>
```

> [!NOTE]
> The utility of static fallbacks for `sign` and `abs` is limited.
> The most interesting values are variables and dynamic values (e.g. those containing `%`).
> It is impossible to generate static fallbacks in a build process for values that are dynamic on the client.

<usage>

<envSupport>

## ⚠️ About custom properties

Given the dynamic nature of custom properties it's impossible to know what the variable value is, which means the plugin can't compute a final value for the stylesheet. 

Because of that, any usage that contains a `var` is skipped.

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is preserved.

```js
<exportName>({ preserve: false })
```

```css
<example.css>

/* becomes */

<example.preserve-false.expect.css>
```

<linkList>
[CSS Values 4]: <specUrl>
