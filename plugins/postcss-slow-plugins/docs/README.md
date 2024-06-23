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

[<humanReadableName>] lets you easily check which plugins have the most impact on your build duration.

PostCSS is incredibly fast but adding too many plugins or a few slow ones can still cause issues.

Typical causes of slow PostCSS setups are :
- you have a lot of CSS
- you have a lot of plugins
- a specific plugin is very slow

This plugin is intended to make it visible which plugins are the most impactful on the duration of CSS processing.

We also welcome anyone to report performance issues so that we can improve the performance of popular plugins.  
However we ask that everyone is respectful when doing so.  
No one is required to fix your performance issue.

We strongly believe that PostCSS setups can and should be fast and efficient.


## How to measure

[<humanReadableName>] itself is also just a PostCSS plugin.  
Simply add it to your config as you would any other plugin and run your build.

This will take a long time.

Seriously, a very long time.

It will profile your build twice for each plugin :
- once with only that plugin **disabled**
- once with only that plugin **enabled**

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

Most impactful to improve, ordered by drop in duration when excluded:
┌─────────┬───────────┬─────────────┬──────────┬──────────────────────────────────────────┬───────────────────────┐
│ (index) │  duration │ kb's per ms │   drop   │                   name                   │ index in plugins list │
├─────────┼───────────┼─────────────┼──────────┼──────────────────────────────────────────┼───────────────────────┤
│    0    │ '10.69ms' │ '0.93kb/ms' │   '--'   │           '-- all plugins --'            │         '--'          │
│    1    │ '6.88ms'  │ '1.45kb/ms' │ '3.80ms' │ 'postcss-gradients-interpolation-method' │           9           │
│    2    │ '7.12ms'  │ '1.40kb/ms' │ '3.56ms' │ 'postcss-progressive-custom-properties'  │          25           │
│    3    │ '7.13ms'  │ '1.40kb/ms' │ '3.55ms' │    'postcss-normalize-display-values'    │          18           │
│    4    │ '7.28ms'  │ '1.37kb/ms' │ '3.41ms' │       'postcss-color-mix-function'       │          10           │
│    5    │ '7.28ms'  │ '1.37kb/ms' │ '3.40ms' │    'postcss-stepped-value-functions'     │          20           │
│    6    │ '7.29ms'  │ '1.37kb/ms' │ '3.39ms' │         'postcss-cascade-layers'         │          23           │
│    7    │ '7.32ms'  │ '1.36kb/ms' │ '3.36ms' │    'postcss-trigonometric-functions'     │          21           │
│    8    │ '7.32ms'  │ '1.36kb/ms' │ '3.36ms' │         'postcss-color-function'         │          14           │
│    9    │ '7.33ms'  │ '1.36kb/ms' │ '3.36ms' │            'postcss-ic-unit'             │          19           │
│   10    │ '7.34ms'  │ '1.36kb/ms' │ '3.35ms' │          'postcss-lab-function'          │          12           │
└─────────┴───────────┴─────────────┴──────────┴──────────────────────────────────────────┴───────────────────────┘
Most impactful to improve, ordered by increase in duration when running alone:
┌─────────┬───────────┬──────────────┬──────────────────────────────────────────┬───────────────────────┐
│ (index) │ duration  │ kb's per ms  │                   name                   │ index in plugins list │
├─────────┼───────────┼──────────────┼──────────────────────────────────────────┼───────────────────────┤
│    0    │ '2.17ms'  │ '4.61kb/ms'  │ 'postcss-gradients-interpolation-method' │           9           │
│    1    │ '2.00ms'  │ '5.00kb/ms'  │     'postcss-relative-color-syntax'      │          11           │
│    2    │ '1.96ms'  │ '5.09kb/ms'  │          'postcss-lab-function'          │          12           │
│    3    │ '1.94ms'  │ '5.14kb/ms'  │       'postcss-color-mix-function'       │          10           │
│    4    │ '1.83ms'  │ '5.46kb/ms'  │            'postcss-nesting'             │           3           │
│    5    │ '1.82ms'  │ '5.50kb/ms'  │          'postcss-custom-media'          │           0           │
│    6    │ '1.81ms'  │ '5.50kb/ms'  │         'postcss-color-function'         │          14           │
│    7    │ '1.76ms'  │ '5.68kb/ms'  │    'postcss-normalize-display-values'    │          18           │
│    8    │ '1.75ms'  │ '5.72kb/ms'  │        'postcss-custom-selectors'        │           4           │
│    9    │ '1.73ms'  │ '5.77kb/ms'  │    'postcss-stepped-value-functions'     │          20           │
│   10    │ '1.72ms'  │ '5.79kb/ms'  │    'postcss-trigonometric-functions'     │          21           │
└─────────┴───────────┴──────────────┴──────────────────────────────────────────┴───────────────────────┘
```

<usage>

<envSupport>

## Options

### ignore

The `ignore` option allows you to skip profiling specific plugins.  
This is useful to exclude those plugins that are critical anyway.

```js
<exportName>({ ignore: ['postcss-oklab-function'] })
```

<linkList>
