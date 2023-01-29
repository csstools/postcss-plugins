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

[<humanReadableName>] lets you use `sin`, `cos`, `tan`, `asin`, `acos`, `atan` and `atan2` to be able to compute trigonometric relationships following the [CSS Values 4] specification.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## ⚠️ About custom properties

Given the dynamic nature of custom properties it's impossible to know what the variable value is, which means the plugin can't compute a final value for the stylesheet.

Because of that, any usage that contains a `var` is skipped.

## Units

[<humanReadableName>] lets you use different special units that are within the spec and computed at run time to be able to calculate the result of the trigonometric function.

The following units are supported:

* `pi`: Computes to `Math.PI` which is `3.141592653589793`
* `e`: Computes to `Math.E` which is `2.718281828459045`
* `infinity`, `-infinity`: Compute to `Infinity` and `-Infinity` respectively. Note that the usage is case insensitive so `InFiNiTy` is a valid value.

Some calculations (such as `sin(-infinity)`) might return `NaN` as per the spec. Given that `NaN` can't be replaced with a value that's useful to CSS it is left as is, as the result will be effectively ignored by the browser.

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
<exportName>({ preserve: true })
```

```pcss
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

<linkList>
[CSS Values 4]: <specUrl>
