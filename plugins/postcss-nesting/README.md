# PostCSS Nesting [![Build Status][ci-img]][ci]

<img align="right" width="135" height="95" src="http://postcss.github.io/postcss/logo-leftp.png" title="Philosopher’s stone, logo of PostCSS">

[PostCSS Nesting] is a [PostCSS] plugin that transforms W3C [CSS Nesting Module Level 3] syntax (@tabatkins’ proposal) to more compatible CSS.

```css
/* before */

a, b {
    color: red;

    {
        c, d {
            color: white;
        }

        & & {
            color: blue;
        }

        &:hover {
            color: white;
        }
    }
}

/* after */

a, b {
    color: red;
}

a c, b c, a d, b d {
    color: white;
}

a a, a b, b a, b b {
    color: blue;
}

a:hover, b:hover {
    color: white;
}
```

From [CSS Nesting Module Level 3]:
> This module introduces the ability to nest one style rule inside another, with the selector of the child rule relative to the selector of the parent rule. This increase the modularity and maintainability of CSS stylesheets.

## Usage

You just need to follow these two steps to use [PostCSS Nesting]:

1. Add [PostCSS] to your build tool.
2. Add [PostCSS Nesting] as a PostCSS process.

```sh
npm install postcss-nesting --save-dev
```

### Node

```js
postcss([ require('postcss-nesting')({ /* options */ }) ])
```

### Grunt

Install [Grunt PostCSS]:

```shell
npm install postcss-nesting --save-dev
```

Enable [PostCSS Nesting] within your Gruntfile:

```js
grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
    postcss: {
        options: {
            processors: [
                require('postcss-nesting')({ /* options */ })
            ]
        },
        dist: {
            src: 'css/*.css'
        }
    }
});
```

[ci]: https://travis-ci.org/jonathantneal/postcss-nesting
[ci-img]: https://travis-ci.org/jonathantneal/postcss-nesting.svg
[CSS Nesting Module Level 3]: http://tabatkins.github.io/specs/css-nesting/
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Nesting]: https://github.com/jonathantneal/postcss-nesting
