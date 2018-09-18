import tape from "tape"

import postcss from "postcss"
import selectorNot from "../src/index.js"

function transform(css, options = {}) {
  return postcss(selectorNot(options)).process(css).css
}

tape("postcss-selector-not", t => {
  t.equal(
    transform("body {}"),
    "body {}",
    "should do nothing if there is no :not"
  )

  t.equal(
    transform("body, Not {}"),
    "body, Not {}",
    "should really do nothing if there is no :not"
  )

  t.equal(
    transform(":not(a, b) {}"),
    ":not(a):not(b) {}",
    "should transform simple :not()"
  )

  t.equal(
    transform("tag:not(.class, .class2) {}"),
    "tag:not(.class):not(.class2) {}",
    "should transform directes :not()"
  )

  t.equal(
    transform("tag :not(tag2, tag3) {}"),
    "tag :not(tag2):not(tag3) {}",
    "should transform :not()"
  )

  t.equal(
    transform("tag :not(tag2, tag3) :not(tag4, tag5) {}"),
    "tag :not(tag2):not(tag3) :not(tag4):not(tag5) {}",
    "should transform mutltiples :not()"
  )

  t.equal(
    transform("tag :not(tag2, tag3) :not(tag4, tag5), test {}"),
    "tag :not(tag2):not(tag3) :not(tag4):not(tag5), test {}",
    "should transform mutltiples :not() with stuff after"
  )

  t.equal(
    transform("tag :not(tag2 :not(tag4, tag5), tag3) {}"),
    "tag :not(tag2 :not(tag4):not(tag5)):not(tag3) {}",
    "should transform :not() recursively"
  )

  t.equal(
    transform(".foo:not(:nth-child(-n+2), .bar) {}"),
    ".foo:not(:nth-child(-n+2)):not(.bar) {}",
    "should transform childs with parenthesis"
  )

  t.equal(
    transform(`a:not(
  .b,
  .c
) {}`),
    "a:not(.b):not(.c) {}",
    "should works with lots of whitespace"
  )

  t.equal(
    transform(".foo:not(:hover, :focus)::before {}"),
    ".foo:not(:hover):not(:focus)::before {}",
    "should work with something after :not()"
  )

  t.equal(
    transform(".foo\\:not-italic {}"),
    ".foo\\:not-italic {}",
    "should not replace selectors with escaped colons followed by not"
  )

  t.equal(
    transform(".foo\\:not-italic:not(:hover, :focus) {}"),
    ".foo\\:not-italic:not(:hover):not(:focus) {}",
    "should replace pseudo selectors without touching escaped colons"
  )

  t.end()
})
