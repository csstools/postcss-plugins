<!-- Available Variables: -->
<!-- <humanReadableName> PostCSS Your Plugin -->
<!-- <exportName> postcssYourPlugin -->
<!-- <packageName> @csstools/postcss-your-plugin -->
<!-- <packageVersion> 1.0.0 -->
<!-- <packagePath> plugins/postcss-your-plugin -->
<!-- <cssdbId> your-feature -->
<!-- <specUrl> https://www.w3.org/TR/css-color-4/#funcdef-color -->
<!-- <example.css> file contents for examples/example.css -->
<!-- <header> -->
<!-- <usage> usage instructions -->
<!-- <envSupport> -->
<!-- <corsWarning> -->
<!-- <linkList> -->
<!-- <parallelBuildsNotice> -->
<!-- to generate : npm run docs -->

<header>

[<humanReadableName>] lets you write TODOs in CSS that ensure you actually do them.

Based on [todo-or-die in rust](https://github.com/davidpdrsn/todo-or-die) and [todo-or-die in ruby](https://github.com/searls/todo_or_die)

The intention is to get a clear signal when a TODO can be resolved.<br>
The clearest signal is a hard error. It forces you to stop and resolve the issue.

`@todo-or-die` rules are considered open TODOs while they are true.<br>
Once they become false they will throw an exception.

```pcss
<example.css>

/* becomes */

<example.expect.css>
```

<usage>

<envSupport>

## Syntax

[<humanReadableName>] is non-standard and is not part of any official CSS Specification.

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

<linkList>
