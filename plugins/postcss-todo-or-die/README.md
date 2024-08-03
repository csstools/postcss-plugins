# PostCSS Todo or Die [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

`npm install @csstools/postcss-todo-or-die --save-dev`

[PostCSS Todo or Die] lets you write TODOs in CSS that ensure you actually do them.

Based on [todo-or-die in rust](https://github.com/davidpdrsn/todo-or-die) and [todo-or-die in ruby](https://github.com/searls/todo_or_die)

The intention is to get a clear signal when a TODO can be resolved.<br>
The clearest signal is a hard error. It forces you to stop and resolve the issue.

`@todo-or-die` rules are considered open TODOs while they are true.<br>
Once they become false they will throw an exception.

```pcss
.baz {
	/* "hwb" is fully supported */
	@todo-or-die browserslist("chrome < 101, safari < 15, firefox < 96");
	color: pink;
	color: hwb(350 75% 0%);

	/* do something after a date */
	@todo-or-die before-date(3000 01 01);
	content: "2000";
}

/* You can also wrap large chunks of CSS */
@todo-or-die if(20 > 16) {
	.baz {
		color: green;
	}
}

/* becomes */

.baz {
	/* "hwb" is fully supported */
	color: pink;
	color: hwb(350 75% 0%);

	/* do something after a date */
	content: "2000";
}

/* You can also wrap large chunks of CSS */
.baz {
		color: green;
	}
```

## Usage

Add [PostCSS Todo or Die] to your project:

```bash
npm install postcss @csstools/postcss-todo-or-die --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssTodoOrDie = require('@csstools/postcss-todo-or-die');

postcss([
	postcssTodoOrDie(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```



## Syntax

[PostCSS Todo or Die] is non-standard and is not part of any official CSS Specification.

### `@todo-or-die` rule

The `@todo-or-die` rule is used to indicate which parts of your CSS have a TODO.
You can either use a lone rule or a block around CSS.

```pcss
.foo {
	@todo-or-die if(10 > 8);
	color: pink;
}

@todo-or-die if(10 > 8) {
	.foo {
		color: pink;
	}
}
```

You can use these conditions :

| condition | todo | dies |
| --- | --- | --- |
| `if` | when `true` or `unknown` | when `false` |
| `not` | when `false` or `unknown` | when `true` |
| `before-date` | when "now" is before the date | when "now" is after |
| `browserslist` | when browsers match those of your project | when no browsers match |

```pcss
@todo-or-die if(10 > 8);
@todo-or-die not(10 < 8);
@todo-or-die before-date(2006 01 31); /* year month day */
@todo-or-die browserslist("chrome <= 80");
```

You can combine this plugin with others like `@csstools/postcss-design-tokens` :

```pcss
@todo-or-die if(10 > design-token('foo.bar'));
```

```
@todo-or-die if(<value> <operator> <value>);
@todo-or-die not(<value> <operator> <value>);
@todo-or-die before-date(<integer> <integer> <integer>);
@todo-or-die browserslist(<string>);

<operator> = [ '<' | '>' | '=' ]
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test

[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/@csstools/postcss-todo-or-die

[PostCSS]: https://github.com/postcss/postcss
[PostCSS Todo or Die]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-todo-or-die
