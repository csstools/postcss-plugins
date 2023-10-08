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
- bundle with `@csstools/postcss-bundler`
- inject `@custom-media` with `@csstools/postcss-global-data`
- inject CSS variables with `postcss-jit-props`
- nesting and other modern features with `postcss-preset-env`
- minify with `@csstools/postcss-minify`

See `package.json` for the full list of dependencies and the scripts.

## Reading

- [`open props`](https://open-props.style/)
- [`@csstools/postcss-bundler`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler)
- [`@csstools/postcss-global-data`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data)
- [`@csstools/postcss-minify`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-minify)
- [`postcss-cli`](https://github.com/postcss/postcss-cli)
- [`postcss-jit-props`](https://github.com/GoogleChromeLabs/postcss-jit-props)
