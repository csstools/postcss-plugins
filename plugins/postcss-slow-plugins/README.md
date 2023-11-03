# PostCSS Slow Plugins [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/postcss-slow-plugins.svg" height="20">][npm-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

```bash
npm install @csstools/postcss-slow-plugins --save-dev
```

[PostCSS Slow Plugins] lets you easily check which plugins have the most impact on your build duration.

PostCSS is incredibly fast but adding too many plugins or a few slow ones can still cause issues.

Typical causes of slow PostCSS setups are :
- you have a lot of CSS
- you have a lot of plugins
- a specific plugin is very slow

This plugin is intended to make it visible which plugins are the most impactful to remove/disable.

We also welcome anyone to report performance issues so that we can improve the performance of popular plugins.  
However we ask that everyone is respectful when doing so.  
No one is required to fix your performance issue.

We strongly believe that PostCSS setups can and should be fast and efficient.


## How to measure

[PostCSS Slow Plugins] itself is also just a PostCSS plugin.  
Simply add it to your config as you would any other plugin and run your build.

This will take a long time.

Seriously, a very long time.

It will profile your build twice for each plugin :
- once with only that plugin disabled
- once with only that plugin enabled

When profiling it will run your build 20 times to get a mean duration.

So expect this to take `N * 20 * 2` times longer than your normal build.


## Some tips to improve performance

- make sure your `browserslist` config is accurate and up to date
- make sure `caniuse-lite` is up to date
- add a dev specific config with minimal plugins
- remove plugins that do trivial things you could do by hand
- remove plugins for static values that could be generated once


## Example output

```
Analyzing with file:
  plugins/postcss-slow-plugins/test/basic.css

Most impactful to remove, ordered by drop in duration when excluded:
┌─────────┬────────────┬──────────────┬───────────┬──────────────────────────────────────────┬───────────────────────┐
│ (index) │  duration  │ kb's per ms  │   drop    │                   name                   │ index in plugins list │
├─────────┼────────────┼──────────────┼───────────┼──────────────────────────────────────────┼───────────────────────┤
│    0    │ '10.692ms' │ '0.937kb/ms' │   '--'    │           '-- all plugins --'            │         '--'          │
│    1    │ '6.884ms'  │ '1.455kb/ms' │ '3.808ms' │ 'postcss-gradients-interpolation-method' │           9           │
│    2    │ '7.128ms'  │ '1.405kb/ms' │ '3.564ms' │ 'postcss-progressive-custom-properties'  │          25           │
│    3    │ '7.138ms'  │ '1.403kb/ms' │ '3.554ms' │    'postcss-normalize-display-values'    │          18           │
│    4    │ '7.281ms'  │ '1.376kb/ms' │ '3.411ms' │       'postcss-color-mix-function'       │          10           │
│    5    │ '7.286ms'  │ '1.375kb/ms' │ '3.406ms' │    'postcss-stepped-value-functions'     │          20           │
│    6    │ '7.299ms'  │ '1.372kb/ms' │ '3.393ms' │         'postcss-cascade-layers'         │          23           │
│    7    │ '7.327ms'  │ '1.367kb/ms' │ '3.366ms' │    'postcss-trigonometric-functions'     │          21           │
│    8    │ '7.329ms'  │ '1.367kb/ms' │ '3.363ms' │         'postcss-color-function'         │          14           │
│    9    │ '7.332ms'  │ '1.366kb/ms' │ '3.361ms' │            'postcss-ic-unit'             │          19           │
│   10    │ '7.342ms'  │ '1.364kb/ms' │ '3.350ms' │          'postcss-lab-function'          │          12           │
└─────────┴────────────┴──────────────┴───────────┴──────────────────────────────────────────┴───────────────────────┘
Most impactful to remove, ordered by increase in duration when running alone:
┌─────────┬───────────┬──────────────┬──────────────────────────────────────────┬───────────────────────┐
│ (index) │ duration  │ kb's per ms  │                   name                   │ index in plugins list │
├─────────┼───────────┼──────────────┼──────────────────────────────────────────┼───────────────────────┤
│    0    │ '2.171ms' │ '4.613kb/ms' │ 'postcss-gradients-interpolation-method' │           9           │
│    1    │ '2.000ms' │ '5.007kb/ms' │     'postcss-relative-color-syntax'      │          11           │
│    2    │ '1.965ms' │ '5.097kb/ms' │          'postcss-lab-function'          │          12           │
│    3    │ '1.948ms' │ '5.142kb/ms' │       'postcss-color-mix-function'       │          10           │
│    4    │ '1.833ms' │ '5.465kb/ms' │            'postcss-nesting'             │           3           │
│    5    │ '1.821ms' │ '5.500kb/ms' │          'postcss-custom-media'          │           0           │
│    6    │ '1.819ms' │ '5.507kb/ms' │         'postcss-color-function'         │          14           │
│    7    │ '1.762ms' │ '5.684kb/ms' │    'postcss-normalize-display-values'    │          18           │
│    8    │ '1.750ms' │ '5.724kb/ms' │        'postcss-custom-selectors'        │           4           │
│    9    │ '1.734ms' │ '5.777kb/ms' │    'postcss-stepped-value-functions'     │          20           │
│   10    │ '1.729ms' │ '5.792kb/ms' │    'postcss-trigonometric-functions'     │          21           │
└─────────┴───────────┴──────────────┴──────────────────────────────────────────┴───────────────────────┘
```

## Usage

Add [PostCSS Slow Plugins] to your project:

```bash
npm install postcss @csstools/postcss-slow-plugins --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssSlowPlugins = require('@csstools/postcss-slow-plugins');

postcss([
	postcssSlowPlugins(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Slow Plugins] runs in all Node environments, with special
instructions for:

- [Node](INSTALL.md#node)
- [PostCSS CLI](INSTALL.md#postcss-cli)
- [PostCSS Load Config](INSTALL.md#postcss-load-config)
- [Webpack](INSTALL.md#webpack)
- [Next.js](INSTALL.md#nextjs)
- [Gulp](INSTALL.md#gulp)
- [Grunt](INSTALL.md#grunt)

## Options

### ignore

The `ignore` option allows you to skip profiling specific plugins.  
This is useful to exclude those plugins that are critical anyway.

```js
postcssSlowPlugins({ ignore: ['postcss-oklab-function'] })
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-slow-plugins

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Slow Plugins]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-slow-plugins
