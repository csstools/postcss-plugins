var test = require("tape")
var postcss = require("postcss")
var plugin = require("../src")

function transform(input, opts = {}, postcssOpts = {}) {
  return postcss()
    .use(plugin(opts))
    .process(input, postcssOpts)
}

test("@custom-selector", function(t) {
  t.equal(
    transform(
      ``
    ).css,
    ``,
    "should works with nothing"
  )

  const undefinedResult = transform(":--undef {}")
  t.ok(
    undefinedResult.messages && undefinedResult.messages.length === 1,
    "should add a message when a custom selectors is undefined"
  )

  t.equal(
    transform(
      `@custom-selector :--foo .bar, .baz;
.foo:--foo {
  margin-top: 16px;
}`,
      {transformMatches: false}
    ).css,
    `.foo:matches(.bar, .baz) {
  margin-top: 16px;
}`,
    "should works be able to limit transformation to :matches()"
  )

  t.equal(
    transform(
      `@custom-selector :--heading h1, h2, h3, h4, h5, h6;

article :--heading + p {}`
    ).css,
    `article h1 + p,
article h2 + p,
article h3 + p,
article h4 + p,
article h5 + p,
article h6 + p {}`,
    "should transform heading"
  )

  t.equal(
    transform(
      `@custom-selector :--foobar .foo, .bar;
@custom-selector :--baz .baz;
@custom-selector :--fizzbuzz .fizz, .buzz;
@custom-selector :--button-types
  .btn-primary,
  .btn-success,
  .btn-info,
  .btn-warning,
  .btn-danger;

:--foobar > :--baz {}

:--fizzbuzz > :--foobar {}

:--button-types, :--button-types:active {}`
    ).css,
    `.foo > .baz,
.bar > .baz {}

.fizz > .foo,
.buzz > .foo,
.fizz > .bar,
.buzz > .bar {}

.btn-primary,
.btn-success,
.btn-info,
.btn-warning,
.btn-danger,
.btn-primary:active,
.btn-success:active,
.btn-info:active,
.btn-warning:active,
.btn-danger:active {}`,
    "should work with a complicated example"
  )

  t.equal(
    transform(
      `/* comment */
@custom-selector :--foo
  /* comment */
  .foo,
  .bar > .baz;


/* comment */
      :--foo + p {
    display: block;
  }`
    ).css,
    `/* comment */


/* comment */
      .foo + p,
      .bar > .baz + p {
    display: block;
  }`,
    "should works with comments"
  )

  t.equal(
    transform(
      `@custom-selector :--pseudo ::before, ::after;

.foo > a:--pseudo img {
  display: block;
}
`
    ).css,
    `.foo > a::before img,
.foo > a::after img {
  display: block;
}
`,
    "should works with pseudo elements"
  )

  t.equal(
    transform(
      `@custom-selector :--foo .foo;

:--foo, :--foo.bar {
  color: white;
}
`
    ).css,
    `.foo,
.foo.bar {
  color: white;
}
`,
    "should works handle multiples combined selectors"
  )

  t.equal(
    transform(
      `@custom-selector :--foo h1, h2, h3;
@custom-selector :--ba-----r h4, h5, h6;

.fo--oo > :--foo {
  margin: auto;
}

:--ba-----r:hover .ba--z {
  display: block;
}
`
    ).css,
    `.fo--oo > h1,
.fo--oo > h2,
.fo--oo > h3 {
  margin: auto;
}

h4:hover .ba--z,
h5:hover .ba--z,
h6:hover .ba--z {
  display: block;
}
`,
    "should works with weird identifiers"
  )

  t.equal(
    transform(
      `@custom-selector :--heading h1, h2, h3, h4, h5, h6;
/* comment */

  article :--heading + p {
    margin-top: 0;
  }
`,
      {lineBreak: false}
    ).css,
    `/* comment */

  article h1 + p, article h2 + p, article h3 + p, article h4 + p, ` +
  `article h5 + p, article h6 + p {
    margin-top: 0;
  }
`,
    "should works works with no line breaks"
  )

  t.equal(
    transform(
      `@custom-selector :--multiline
  .foo,
  .bar > .baz;

:--multiline {
  display: block;
}
`
    ).css,
    `.foo,
.bar > .baz {
  display: block;
}
`,
    "should works with multilines definition"
  )

  t.equal(
    transform(
      `@custom-selector :--any .foo, .bar;
@custom-selector :--foo .baz;

:--any h1 {
  margin-top: 16px;
}

main :--foo + p {
  margin-top: 16px;
}
`,
      {
        extensions: {
          ":--any": "section, article, aside, nav",
          ":--foo": "input[type=\"text\"] > section, #nav .bar",
        },
      }
    ).css,
    `section h1,
article h1,
aside h1,
nav h1 {
  margin-top: 16px;
}

main input[type="text"] > section + p,
main #nav .bar + p {
  margin-top: 16px;
}
`,
    "should transform local extensions"
  )

  var postcssPlugin = postcss().use(plugin())
  t.ok(
    postcssPlugin.process("@custom-selector :--foobar .foo;:--foobar{}").css,
    "should not create a memory"
  )
  t.equal(
    postcssPlugin.process(":--foobar{}").css,
    ":--foobar{}",
    "should have no memory about previous processing"
  )

  t.end()
})
