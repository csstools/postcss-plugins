# PostCSS Custom Selector [![Build Status](https://travis-ci.org/postcss/postcss-custom-selector.png)](https://travis-ci.org/postcss/postcss-custom-selector)

> [PostCSS](https://github.com/postcss/postcss) 实现 [W3C CSS Extensions(Custom Selectors)](http://dev.w3.org/csswg/css-extensions/#custom-selectors) 的插件。



## 安装(暂未发布)

    $ npm install postcss-custom-selector

## 快速开始

```js
// dependencies
var fs = require('fs')
var postcss = require('postcss')
var selector = require('postcss-custom-selector')

// css to be processed
var css = fs.readFileSync('input.css', 'utf8')

// process css using postcss-custom-selector
var output = postcss()
  .use(selector())
  .process(css)
  .css
  
console.log('\n\n ====>Output CSS:\n',output)  
```

或者：

```js
var output = postcss(selector())
  .process(css)
  .css
```

input.css：

```css
@custom-selector --heading h1, h2, h3, h4, h5, h6;

article --heading + p{ 
  margin-top: 0;
}
```

你将得到：

```css
article h1 + p, article h2 + p, article h3 + p, article h4 + p, article h5 + p, article h6 + p{
  margin-top: 0;
}
```

## CSS 语法

A custom selector is defined with the `@custom-selector` rule:

    @custom-selector = @custom-selector <extension-name> <selector>;

This defines a custom selector which is written as a pseudo-class with the given `<extension-name>`, and represents a `:matches()` selector using the provided `<selector>` as its argument.


For example, if an author wanted to easily refer to all heading elements in their HTML document, they could create an alias:

```css
@custom-selector :--heading h1, h2, h3, h4, h5, h6;

:--heading { /* styles for all headings */ }
:--heading + p { /* more styles */ }
/* etc */
```

## 如何使用

### 伪元素/伪类

你可以使用 

* `:` 自定义一个伪类。
* `::`自定义一个伪元素。

例如，模拟一个 :any-link 选择器：

input.css:

```css
@custom-selector :--any-link :link, :visited;

a:--any-link {
  color: blue;
}
```

output:

```css
a:link, a:visited {
  color: blue;
}
```
### 多个选择器

`@custom-selector` 类似 CSS [`:matches()`](http://dev.w3.org/csswg/selectors-4/#matches) 选择器，但是目前**不支持**在同一个选择器中调用多个自定义选择器，例如：

```css
@custom-selector --heading h1, h2, h3, h4, h5, h6;
@custom-selector :--any-link :link, :visited;

.demo --heading, a:--any-link { 
  font-size: 32px;
}
```
将会输出错误的 CSS 代码。

### Grunt

```js
grunt.initConfig({
  postcss: {
    options: {
      processors: [require('postcss-custom-selector').postcss]
    },
    dist: {
      src: 'css/*.css'
    }
  }
});

grunt.loadNpmTasks('grunt-postcss');
```

### Gulp

```js
var gulp = require('gulp');
var postcss = require('gulp-postcss');

gulp.task('css', function() {
  return gulp.src('./src/*.css')
    .pipe(postcss([require('postcss-custom-selector')]))
    .pipe(gulp.dest('./dest'));
});
```



### 选项

**`extensions`** (默认: `{}`)

该选项允许你自定义一个对象来设置 `<extension-name>`（选择器别名）和 `<selector>`，这些定义将覆盖 CSS 中相同别名的 `@custom-selector`。

```js
var options = {
  extensions: {
    ':--any' : 'section, article, aside, nav'
  }
}

var output = postcss(selector(options))
  .process(css)
  .css;
```

input.css

```css
@custom-selector :--any .foo, .bar; /* 不会生效 */
:--any h1 {
  margin-top: 16px;
}
```

output:

```css
section h1, article h1, aside h1, nav h1 {
  margin-top: 16px;
}
```


## 贡献

* 安装相关依赖模块
* 尊重编码风格（安装）
* 运行测试

```
$ git clone https://github.com/postcss/postcss-custom-selector.git
$ git checkout -b patch
$ npm install
$ npm test
```

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
