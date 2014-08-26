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

function compareFixtures(t, name, options) {
  var actual = postcss(customProperties(options)).process(fixture(name), {from: fixturePath(name)}).css.trim()

  // handy thing: checkout actual in the *.actual.css file
  fs.writeFile(fixturePath(name + ".actual"), actual)

  var expected = fixture(name + ".out")
  return t.equal(actual, expected, "processed fixture '" + name + "' should be equal to expected output")
}

test("throw errors", function(t) {
  t.throws(function() {
    return postcss(customProperties()).process(fixture("substitution-empty")).css
  }, /must contain a non-whitespace string/, "throws an error when a variable function is empty")

  t.throws(function() {
    return postcss(customProperties()).process(fixture("substitution-malformed")).css
  }, /missing closing/, "throws an error when a variable function is malformed")

  t.throws(function() {
    return postcss(customProperties()).process(fixture("substitution-undefined")).css
  }, /is undefined/, "throws an error when a variable function references an undefined variable")

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
