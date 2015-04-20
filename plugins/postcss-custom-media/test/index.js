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

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var result = postcss()
    .use(plugin(opts))
    .process(read(postcssOpts.from), postcssOpts)
  var actual = result.css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual.trim(), expected.trim(), msg)

  return result
}

test("@custom-media", function(t) {
  compareFixtures(
    t,
    "transform",
    "should transform custom media"
  )

  compareFixtures(
    t,
    "transform-all",
    "should replaces all extension names"
  )

  compareFixtures(
    t,
    "transform-reference",
    "should transform custom media referencing another custom media"
  )

  compareFixtures(
    t,
    "transform-self-reference",
    "should transform custom media with self reference"
  )

  compareFixtures(
    t,
    "transform-circular-reference",
    "should transform custom media with circular reference"
  )

  var undefinedRes = compareFixtures(
    t,
    "undefined",
    "should remove undefined @media"
  )

  t.ok(
    undefinedRes.warnings()[0].text.match(/Missing @custom-media/),
    "should send warning to postcss"
  )

  compareFixtures(
    t,
    "js-defined",
    "should transform custom media and override local extensions",
    {
      extensions: {
        "--viewport-max-s": "(max-width: 30em)",
        "--viewport-min-s": "(min-width: 30.01em)",
      },
    }
  )

  compareFixtures(
    t,
    "js-defined",
    "should transform custom media and override local unprefixed extensions",
    {
      extensions: {
        "viewport-max-s": "(max-width: 30em)",
        "viewport-min-s": "(min-width: 30.01em)",
      },
    }
  )

  compareFixtures(
    t,
    "preserve",
    "should preserve custom media",
    {preserve: true}
  )

  compareFixtures(
    t,
    "append",
    "should append custom media",
    {
      extensions: {
        "--viewport-max-s": "(max-width: 30em)",
        "--a": "(--a)",
      },
      appendExtensions: true,
    }
  )

  t.end()
})
