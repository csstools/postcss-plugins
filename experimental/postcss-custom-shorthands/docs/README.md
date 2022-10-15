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

[<humanReadableName>] lets you try out custom shorthands in CSS to give feedback on the [Proposed feature].

⚠️ This is not a feature that is on a standards track. ⚠️

Please do not use this in real projects.
It is intended to try out the feature to see if it is useful.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Options

### experimentalVersion

The `experimentalVersion` option determines which proposal you are using.
The latest proposal is mostly the default. (currently `2`)

- 1 : https://github.com/w3c/csswg-drafts/issues/7879#issue-1407763311
- 2 : https://github.com/w3c/csswg-drafts/issues/7879#issuecomment-1279688467

```js
<exportName>({ experimentalVersion: 1 })
```

```pcss
<example-0001.css>

/* becomes */

<example-0001.expect.css>
```

### atRuleName

The `atRuleName` option determines the At Rule name.
This feature is just a random thought by one person and not in any way on a standards track.
To avoid conflicts with current and future standard CSS we use vendor prefixes (`@csstools-shorthand-property`).

This option lets you pick an At Rule name that works for you.

```js
<exportName>({ atRuleName: 'my-shorthand-property' })
```

### generateVSCodeCustomDataInDirectory

The proposed feature can be abused to make stylesheets very hard to read and edit.
More so than other features.

We believe that editor support is critical to compensate for this.
To illustrate some of the benefits you can generate [custom data for VSCode](https://code.visualstudio.com/blogs/2020/02/24/custom-data-format).
This gives you limited editor support and hover help.

```js
<exportName>({ generateVSCodeCustomDataInDirectory: './.vscode/' })
```

```json
{
	"css.customData": [
		"../.vscode/custom-shorthands.css-data.json"
	]
}
```

<linkList>
[Proposed feature]: <specUrl>
