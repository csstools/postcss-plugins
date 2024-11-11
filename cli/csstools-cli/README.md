# CSSTools CLI [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/@csstools/csstools-cli.svg" height="20">][npm-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]


[CSSTools CLI] lets you run any plugin from [@csstools/postcss-plugins](https://github.com/csstools/postcss-plugins) from the command line.

## Usage

We recommend using the [CSSTools CLI] as a prototyping and debugging tool.
With `npx` you can use the CLI directly without installing it globally.

> [!CAUTION]
> If you are building/customizing a toolchain it is best **not** to use the CLI.

### General Help :

```bash
npx -y @csstools/csstools-cli
```

```
CSSTools CLI

  Transform CSS with any plugin from https://github.com/csstools/postcss-plugins

Usage:
  @csstools/csstools-cli postcss-preset-env [input.css] [OPTIONS] [-o|--output output.css]
  @csstools/csstools-cli postcss-preset-env <input.css>... [OPTIONS] --dir <output-directory>
  @csstools/csstools-cli postcss-preset-env <input.css>... [OPTIONS] --replace

Available Plugins:
  postcss-preset-env
  css-blank-pseudo
  css-has-pseudo
  css-prefers-color-scheme
  postcss-attribute-case-insensitive
  postcss-cascade-layers
  postcss-color-function
  postcss-color-functional-notation
  postcss-color-hex-alpha
  postcss-color-mix-function
  postcss-color-rebeccapurple
  postcss-custom-media
  postcss-custom-properties
  postcss-custom-selectors
  postcss-dir-pseudo-class
  postcss-double-position-gradients
  postcss-exponential-functions
  postcss-focus-visible
  postcss-focus-within
  postcss-font-format-keywords
  postcss-gap-properties
  postcss-gradients-interpolation-method
  postcss-hwb-function
  postcss-ic-unit
  postcss-image-set-function
  postcss-is-pseudo-class
  postcss-lab-function
  postcss-light-dark-function
  postcss-logical
  postcss-logical-float-and-clear
  postcss-logical-resize
  postcss-logical-viewport-units
  postcss-media-minmax
  postcss-media-queries-aspect-ratio-number-values
  postcss-nested-calc
  postcss-nesting
  postcss-normalize-display-values
  postcss-oklab-function
  postcss-overflow-shorthand
  postcss-place
  postcss-pseudo-class-any-link
  postcss-scope-pseudo-class
  postcss-selector-not
  postcss-stepped-value-functions
  postcss-text-decoration-shorthand
  postcss-trigonometric-functions
  postcss-unset-value

Plugin Help:
  @csstools/csstools-cli <plugin-name>
  @csstools/csstools-cli postcss-preset-env
```

### Plugin Help :

Each plugin can have specific options.
These can be found by running `npx -y @csstools/csstools-cli <plugin-name>`.
More details can always be found in the README of that plugin on github.

```bash
npx -y @csstools/cli postcss-preset-env
```

```
PostCSS Preset Env

  Lets you convert modern CSS into something most browsers can understand, determining the polyfills you need based on your targeted browsers or runtime environments.

Usage:
  @csstools/cli postcss-preset-env [input.css] [OPTIONS] [-o|--output output.css]
  @csstools/cli postcss-preset-env <input.css>... [OPTIONS] --dir <output-directory>
  @csstools/cli postcss-preset-env <input.css>... [OPTIONS] --replace

Options:
  -o, --output          Output file
  -d, --dir             Output directory
  -r, --replace         Replace (overwrite) the input file
  -m, --map             Create an external sourcemap
  --no-map              Disable the default inline sourcemaps
  -p, --plugin-options  Stringified JSON object with plugin options

Plugin Options:
  stage                         number
  minimumVendorImplementations  number
  features                      object
  env                           string
  browsers                      string
  autoprefixer                  object
  preserve                      boolean
  logical                       object
  enableClientSidePolyfills     boolean
  debug                         boolean

  {
    "stage": 0,
    "minimumVendorImplementations": 2,
    "features": {
      "blank-pseudo-class": {
        "preserve": false
      },
      "color-functional-notation": {
        "preserve": true
      }
    },
    "env": "production",
    "browsers": "last 2 versions",
    "autoprefixer": {
      "grid": true
    },
    "preserve": false,
    "logical": {
      "inlineDirection": "left-to-right",
      "blockDirection": "top-to-bottom"
    },
    "enableClientSidePolyfills": false,
    "debug": false
  }
```

## Example 

Copy this bit of CSS to have it in your clipboard.

```css
a, b {
  color: red;

  & c, & d {
    color: white;
  }
}

```

Run :

_`pbpaste | ...` pipes the clipboard contents to the next command._

```bash
pbpaste | npx -y @csstools/csstools-cli postcss-nesting --no-map
```

Output :

```css
a, b {
  color: red
}
a c, b c, a d, b d {
    color: white;
  }

```


Copy this bit of CSS to have it in your clipboard.

```css
.banner {
  color: #222222;
  inset: logical 0 5px 10px;
  padding-inline: 20px 40px;
  resize: block;
  transition: color 200ms;
}

```

Run :

```bash
pbpaste | npx -y @csstools/csstools-cli postcss-logical --no-map --plugin-options '{ "dir": "rtl" }'
```

_note the single quotes around the JSON object with plugin options._

Output :

```css
.banner {
  color: #222222;
  top: 0;
  left: 5px;
  bottom: 10px;
  right: 5px;
  padding-right: 20px;
  padding-left: 40px;
  resize: vertical;
  transition: color 200ms;
}
```


[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/csstools-cli

[postcss]: https://github.com/postcss/postcss
[CSSTools CLI]: https://github.com/csstools/postcss-plugins/tree/main/cli/csstools-cli
