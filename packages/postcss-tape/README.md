# PostCSS Tape [<img src="http://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][PostCSS]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Licensing][lic-img]][lic-url]
[![Changelog][log-img]][log-url]
[![Gitter Chat][git-img]][git-url]

[PostCSS Tape] lets you quickly test [PostCSS] plugins.

1. Install this dependency to your project:

   ```sh
   npm install postcss-tape --save-dev
   ```

2. Add the `postcss-tape` task to your `package.json`:

   ```json
   {
      "scripts": {
        "test": "postcss-tape"
      }
   }
   ```

3. Add tests to your `.tape.js` file:

   ```js
   module.exports = {
     'postcss-my-plugin': {
       'basic': {
         message: 'supports basic usage'
       }
     }
   };
   ```

That’s it! Empty tests will be auto-generated. Now you can use the `tape` task:

```sh
npm run tape
```

## Options

Options may be passed through `package.json` using `postcssConfig`:

```json
{
  "postcssConfig": {
    "plugin": "path/to/plugin.js",
    "config": "path/to/.tape.js",
    "fixtures": "path/to/cssdir"
  }
}
```

Options may be passed through arguments:

```sh
postcss-tape --plugin=path/to/plugin.js --config=path/to/.tape.js
```

[npm-url]: https://www.npmjs.com/package/postcss-tape
[npm-img]: https://img.shields.io/npm/v/postcss-tape.svg
[cli-url]: https://travis-ci.org/jonathantneal/postcss-tape
[cli-img]: https://img.shields.io/travis/jonathantneal/postcss-tape.svg
[lic-url]: LICENSE.md
[lic-img]: https://img.shields.io/npm/l/postcss-tape.svg
[log-url]: CHANGELOG.md
[log-img]: https://img.shields.io/badge/changelog-md-blue.svg
[git-url]: https://gitter.im/postcss/postcss
[git-img]: https://img.shields.io/badge/chat-gitter-blue.svg

[PostCSS Tape]: https://github.com/jonathantneal/postcss-tape
[PostCSS]: https://github.com/postcss/postcss
