var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var customProperties = require("..")

function fixturePath(name) {
  return "test/fixtures/" + name + ".css"
}

function fixture(name) {
  return fs.readFileSync(fixturePath(name), "utf8").trim()
}

function resolveFixture(name, options) {
  return postcss(customProperties(options)).process(fixture(name), {from: fixturePath(name)}).css.trim()
}

function compareFixtures(t, name, options) {
  var actual = resolveFixture(name, options)

  // handy thing: checkout actual in the *.actual.css file
  fs.writeFile(fixturePath(name + ".actual"), actual)

  var expected = fixture(name + ".expected")
  return t.equal(actual, expected, "processed fixture '" + name + "' should be equal to expected output")
}

test("throw errors", function(t) {
  t.throws(function() {
    return postcss(customProperties()).process(fixture("substitution-empty")).css
  }, /must contain a non-whitespace string/, "throws an error when a variable function is empty")

  t.throws(function() {
    return postcss(customProperties()).process(fixture("substitution-malformed")).css
  }, /missing closing/, "throws an error when a variable function is malformed")

  t.end()
})

test("substitutes nothing when a variable function references an undefined variable", function(t) {
  compareFixtures(t, "substitution-undefined")
  t.end()
})

test("substitutes defined variables in `:root` only", function(t) {
  compareFixtures(t, "substitution-defined")
  t.end()
})

test("accepts variables defined from JavaScript, and overrides local definitions", function(t) {
  compareFixtures(t, "js-defined", {
    variables: {
      "--test-one": "js-one",
      "--test-two": "js-two",
      "--test-three": "js-three",
      "--test-varception": "var(--test-one)",
      "--test-jsception": "var(--test-varception)",
    },
  })
  t.end()
})

test("prefixes js defined variabled with a double dash automatically", function(t) {
  compareFixtures(t, "automatic-variable-prefix", {
    variables: {
      unprefixed: "blue",
      "--prefixed": "white",
    },
  })
  t.end()
})

test("removes variable properties from the output", function(t) {
  compareFixtures(t, "remove-properties")
  t.end()
})

test("ignores variables defined in a media query", function(t) {
  compareFixtures(t, "media-query")
  t.end()
})

test("overwrites variables correctly", function(t) {
  compareFixtures(t, "substitution-overwrite")
  t.end()
})

test("substitutes undefined variables if there is a fallback", function(t) {
  compareFixtures(t, "substitution-fallback")
  t.end()
})

test("supports case-sensitive variables", function(t) {
  compareFixtures(t, "case-sensitive")
  t.end()
})

test("supports !important", function(t) {
  compareFixtures(t, "important")
  t.end()
})

test("preserves variables when `preserve` is `true`", function(t) {
  compareFixtures(t, "preserve-variables", {preserve: true})
  t.end()
})

test("preserves computed value when `preserve` is `\"computed\"`", function(t) {
  compareFixtures(t, "preserve-computed", {preserve: "computed"})
  t.end()
})

test("circular variable references", function(t) {
  compareFixtures(t, "self-reference")
  compareFixtures(t, "circular-reference")
  t.end()
})

test("circular variable references with fallback", function(t) {
  compareFixtures(t, "self-reference-fallback")
  compareFixtures(t, "self-reference-double-fallback")
  t.end()
})

test("append variables", function(t) {
  compareFixtures(t, "append", {
    variables: {
      "--test-one": "js-one",
      "test-two": "js-two",
      "test-three": "var(--test-one, one) var(--test-two, two)",
    },
    preserve: "computed",
    appendVariables: true,
  })
  t.end()
})

test("strict option", function(t) {
  compareFixtures(t, "substitution-strict", {
    strict: false,
  })

  t.end()
})
