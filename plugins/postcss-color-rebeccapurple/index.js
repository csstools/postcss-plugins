/**
 * Module dependencies.
 */
var postcss = require("postcss")
var valueParser = require("postcss-value-parser")
var color = "#639"

/**
 * PostCSS plugin to convert colors
 */
module.exports = postcss.plugin("postcss-color-rebeccapurple", function() {
  return function(style) {
    style.walkDecls(function(decl) {
      var value = decl.value;

      if (value && value.indexOf("rebeccapurple") !== -1) {
        decl.value = valueParser(value).walk(function(node) {
          if (node.type === "word" && node.value === "rebeccapurple") {
            node.value = color
          }
        }).toString()
      }
    })
  }
})
