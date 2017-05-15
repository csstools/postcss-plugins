var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) {
  return "test/" + name + ".css"
}

function read(name) {
  return fs.readFileSync(name, "utf8")
}

function transform(css, options) {
  return postcss(plugin(options)).process(css).css
}

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var actual = transform(read(postcssOpts.from), postcssOpts)
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual, expected, msg)
}

test("hex alpha (#RRGGBBAA or #RGBA)", function(t) {
  compareFixtures(t, "hex-alpha", "should transform #RRGGBBAA and #RGBA")
  t.end()
})
