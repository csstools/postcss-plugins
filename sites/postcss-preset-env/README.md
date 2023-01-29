# PostCSS Preset Env Site [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

The official website for [PostCSS Preset Env].

## Setup

Before you can contribute to the codebase, you will need to fork the repo.

1. [Fork] the repo.
2. Clone your fork locally

   ```bash
   # in a terminal, cd to parent directory where you want your clone to be, then
   git clone https://github.com/<your_github_username>/postcss-plugins.git
   cd postcss-plugins/sites
   
   # Install the needed things to start local development
   # If this gives errors please open an issue so that we can look into it.
   npm run setup-workspace
   ```

This site is built using the following awesome packages:

* [11ty]
* [PostCSS Preset Env] (_we eat our own dog food 🐶!_)
* [CSSDB]
* [Stylelint]

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Preset Env]: https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
[Fork]: https://github.com/csstools/postcss-plugins/fork
[11ty]: https://www.11ty.dev/
[CSSDB]: https://github.com/csstools/cssdb
[Stylelint]: https://stylelint.io/
