var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")
var matches = require("postcss-selector-matches")

function filename(name) { return "test/" + name + ".css" }
function read(name) { return fs.readFileSync(name, "utf8") }

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var actual = postcss()
  .use(plugin(opts))
  .process(read(postcssOpts.from), postcssOpts).css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual.trim(), expected.trim(), msg)
}

test("@custom-selector", function(t) {
  compareFixtures(t, "heading", "should transform heading")
  compareFixtures(t, "pseudo", "should transform pseudo")
  compareFixtures(t, "multiline", "should transform multiline")
  compareFixtures(t, "some-hyphen-selector", "should transform some-hyphen-selector")

  compareFixtures(t, "extension", "should transform local extensions", {
    extensions: {
      ':--any' : 'section, article, aside, nav',
      ':--foo': 'input[type="text"] > section, #nav .bar'
    }
  })

  t.end()
})
