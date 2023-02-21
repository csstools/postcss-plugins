# PostCSS Plugins [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[<img alt="build status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://img.shields.io/discord/853978108758851604?color=5865F2&label=Discord&logo=discord&logoColor=white">][discord]

We are happy you're here!

This repository uses a monorepo architecture that contains plugins, plugin-packs and CLI tools to help you transform your CSS so every browser can understand it.

Our wish is that you can leverage the CSS that will become a standard with every browser!

## A brief look into the structure

This repository leverages [NPM Workspaces] to handle every package/project. 

[PostCSS Plugins] contains tools and plugins for [PostCSS Preset Env].

[PostCSS Preset Env] lets you convert modern CSS into something most browsers
can understand, determining the polyfills you need based on your targeted
browsers or runtime environments.

There's also a [CLI] that allows you to quickly debug or prototype without having to configure PostCSS before you need any toolchain.

Under [sites] you can find websites that we publish to better display all of this information.

## Our current focus

We're trying to bring every reasonable CSS Spec into all the browsers. 

First we keep track of new features through the [CSSDB] (see the [repo][CSSDB Repo]). Then we do our best to create a [PostCSS] plugin that can convert that new syntax/function/rules so every browser can understand it. 

While it's not always possible we're enabling over 30 features with these plugins!

You can keep track of our current efforts on the [PostCSS Preset Env Project] and also read announcements on the [project's discussions][discussions].

## Contributing

Thanks for being willing to contribute! Please read our [contributing guide]!

[cli-img]: https://github.com/csstools/postcss-plugins/workflows/test/badge.svg
[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[discussions]: https://github.com/csstools/postcss-plugins/discussions
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Plugins]: https://github.com/csstools/postcss-plugins
[CLI]: https://github.com/csstools/postcss-plugins/cli/csstools-cli
[sites]: https://github.com/csstools/postcss-plugins/tree/main/sites
[PostCSS Preset Env]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
[NPM Workspaces]: https://docs.npmjs.com/cli/v7/using-npm/workspaces/
[contributing guide]: https://github.com/csstools/postcss-plugins/CONTRIBUTING.md
[CSSDB]: https://cssdb.org/
[CSSDB Repo]: https://github.com/csstools/cssdb
[PostCSS Preset Env Project]: https://github.com/orgs/csstools/projects/3/views/1
