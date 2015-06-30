var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) { return "test/" + name + ".css" }
function read(name) { return fs.readFileSync(name, "utf8") }

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  //input
  postcssOpts.from = filename("fixtures/" + name + "/input")
  opts = opts || {}
  var result = postcss()
  .use(plugin(opts))
  .process(read(postcssOpts.from), postcssOpts)

  var actual = result.css
  //output
  var output = read(filename("fixtures/" + name + "/output"))
  //actual
  fs.writeFile(filename("fixtures/" + name + "/actual"), actual)
  t.equal(actual.trim(), output.trim(), msg)

  return result
}

test("@custom-selector", function(t) {
  compareFixtures(t, "heading", "should transform heading")
  compareFixtures(t, "pseudo", "should transform pseudo")
  compareFixtures(t, "multiline", "should transform multiline")
  compareFixtures(t, "some-hyphen", "should transform some hyphen")
  compareFixtures(t, "matches", "should transform matches selector")
  var similarMatchesResult = compareFixtures(t, "similar-matches", "should transform matches selector")
  t.ok(
    similarMatchesResult.messages && similarMatchesResult.messages.length === 1,
    "should add a message when a custom selectors is undefined"
  )

  compareFixtures(t, "comment", "should transform comment")
  compareFixtures(t, "line-break", "should transform line break", {
    lineBreak: false
  })

  compareFixtures(t, "extension", "should transform local extensions", {
    extensions: {
      ':--any' : 'section, article, aside, nav',
      ':--foo': 'input[type="text"] > section, #nav .bar'
    }
  })

  t.end()
})
