var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) { return "test/" + name + ".css" }
function read(name) { return fs.readFileSync(name, "utf8") }

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var actual = postcss().use(plugin(opts)).process(read(postcssOpts.from), postcssOpts).css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual.trim(), expected.trim(), msg)
}

test("@custom-media", function(t) {
  compareFixtures(t, "transform", "should transform custom media")

  compareFixtures(t, "transform-all", "should replaces all extension names")

  compareFixtures(t, "undefined", "should remove undefined @media")

  compareFixtures(t, "js-defined", "should transform custom media and override local extensions", {
    extensions: {
      "--viewport-max-s": "(max-width: 30em)",
      "--viewport-min-s": "(min-width: 30.01em)"
    }
  })

  t.end()
})
