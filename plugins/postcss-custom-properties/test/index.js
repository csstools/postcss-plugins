var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var customProperties = require("..")

function fixture(name) {
  return fs.readFileSync("test/fixtures/" + name + ".css", "utf8").trim()
}

function compareFixtures(t, name, options) {
  var actual = postcss(customProperties(options)).process(fixture(name)).css.trim()

  // handy thing: checkout actual in the *.actual.css file
  fs.writeFile("test/fixtures/" + name + ".actual.css", actual)

  var expected = fixture(name + ".out")
  return t.equal(actual, expected, "processed fixture '" + name + "' should be equal to expected output")
}

test("throws an error when a variable function is empty", function(t) {
  var output = function() {
    return postcss(customProperties()).process(fixture("substitution-empty")).css
  }
  t.throws(output, Error, "postcss-custom-properties: var() must contain a non-whitespace string")
  t.end()
})

test("throws an error when a variable function is malformed", function(t) {
  var output = function() {
    return postcss(customProperties()).process(fixture("substitution-malformed")).css
  }
  t.throws(output, SyntaxError, "postcss-custom-properties: missing closing \")\" in the value \"var(--t, rgba(0,0,0,0.5)\"")
  t.end()
})

test("throws an error when a variable function references an undefined variable", function(t) {
  var output = function() {
    return postcss(customProperties()).process(fixture("substitution-undefined")).css
  }
  t.throws(output, Error, "postcss-custom-properties: variable \"--t\" is undefined")
  t.end()
})

test("substitutes defined variables in `:root` only", function(t) {
  compareFixtures(t, "substitution-defined")
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

test("preserves variables when `preserve` is `true`", function(t) {
  compareFixtures(t, "preserve-variables", {preserve: true})
  t.end()
})
