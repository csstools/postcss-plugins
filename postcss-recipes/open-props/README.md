# Recipe : Open Props

See : https://open-props.style/

## What does it do?

- Allows you to use the awesome Open Props library!
- Bundle your CSS
- Minify your CSS
- Support modern CSS features
- Have a minimal CSS output

## Moving parts

- run PostCSS with `postcss-cli`
- bundle with `postcss-import`
- inject `@custom-media` with `postcss-global-data`
- inject CSS variables with `postcss-jit-props`
- nesting and other modern features with `postcss-preset-env`
- minify with `cssnano`

See `package.json` for the full list of dependencies and the scripts.

## Reading 

- [cssnano](https://cssnano.co)
- [open props](https://open-props.style/)
- [postcss-cli](https://github.com/postcss/postcss-cli)
- [postcss-global-data](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data)
- [postcss-import](https://www.npmjs.com/package/postcss-import)
- [postcss-jit-props](https://github.com/GoogleChromeLabs/postcss-jit-props)
