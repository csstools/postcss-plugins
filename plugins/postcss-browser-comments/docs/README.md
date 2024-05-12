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

[<humanReadableName>] lets you keep only the CSS you need based on
comments and your [browserslist](https://github.com/browserslist/browserslist).


```pcss
<example-1.css>

/* becomes */

<example-1.expect.css>
```

The comment and rule above would be removed with the following browserslist:

```yml
last 2 chrome versions
```

The rule below would be more carefully altered:

```pcss
<example-2.css>

/* with a `last 2 firefox versions` browserslist becomes */

<example-2.expect.css>
```

<usage>

<envSupport>

## Options

### browsers

The `browsers` option overrides of the project’s browserslist.

```js
<exportName>({ browsers: 'last 2 versions' })
```

<linkList>
