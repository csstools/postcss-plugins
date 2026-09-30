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

[<humanReadableName>] lets you use `@function` custom functions following [CSS Custom Functions and Mixins 1].

Custom functions are still an early draft.  
This plugin is only a partial implementation to avoid conflicts with the final specification.

Unsupported:
- typed parameters without default values
- return types other than the default `type(*)`
- `@function` definitions inside `@container` or `@scope`
- `@function` definitions inside a `@layer` that is itself inside a conditional group rule
- `@function` definitions inside a style rule
- definitions whose body contains anything other than declarations and conditional group rules
- `result` descriptors that resolve to a CSS-wide keyword through a conditional rule or a `var()` fallback
- validation that a typed default value matches its parameter type

Definitions inside `@layer`, `@media` and `@supports` are supported. When a name
has several active definitions, the browser cascade selects the strongest one.

Unsupported definitions are left as-is. A definition is only removed when every
call site is transformed by this plugin, so call sites that are left as-is (for
example inside `@keyframes` or a nested conditional declaration) keep their
definitions.

Untyped parameters with default values are supported and may use any value,
including relative units and `var()` references.

Typed parameters with default values are checked by the browser through a
generated `@property` registration. A default value that is not
computationally independent (for example `1em` or `var(--x)`) can not be used
as an `initial-value` and makes the function unsupported.

```css
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
<exportName>({ preserve: true })
```

```css
<example.css>

/* becomes */

<example.preserve-true.expect.css>
```

<linkList>
[CSS Custom Functions and Mixins 1]: <specUrl>
