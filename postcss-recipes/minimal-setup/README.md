# Recipe : Minimal Setup

A minimal setup for processing CSS with PostCSS.

## What does it do?

- Bundle your CSS
- Support modern CSS features
- Minify your CSS
- Have a fast development build

## Moving parts

- run PostCSS with `postcss-cli`
- bundle with `@csstools/postcss-bundler`
- modern features with `postcss-preset-env`
- minify with `@csstools/postcss-minify`
- target groups of browser versions with `browserslist`

See `package.json` for the full list of dependencies and the scripts.

## `development` vs. `production`

The `watch` script runs everything as normal, this will use the `development` `browserslist` config that you can see in `package.json`.

The `build` script however sets `NODE_ENV=production` and which will use the `production` `browserslist` config.  
Many build tools and stack frameworks will set `NODE_ENV=production` for you when you run a build script.

This example shows how you can use this mechanic to run fewer plugins in development.  
This will make your development builds faster.

## Going toolless?

`@csstools/postcss-bundler` is as close to native browser behavior as possible.  
So you can even chose not to run PostCSS at all in development and load `./src/css/style.css` directly.

This complicates your deploys because you will have to swap out the link url in your html.  
But it also means that you won't have any development build step for CSS at all.

That's a `0ms` build time!

For production however you will still want to minify and bundle your CSS for client performance.  
You will also want to widen your browser support with `postcss-preset-env`.

## Reading

- [`@csstools/postcss-bundler`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-bundler)
- [`@csstools/postcss-minify`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-minify)
- [`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env)
- [`postcss-cli`](https://github.com/postcss/postcss-cli)
- [`browserslist`](https://github.com/browserslist/browserslist)
