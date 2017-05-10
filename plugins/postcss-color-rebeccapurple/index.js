/**
 * Module dependencies.
 */
var postcss = require("postcss")
var color = "#639"

/**
 * PostCSS plugin to convert colors
 */
module.exports = postcss.plugin("postcss-color-rebeccapurple", function() {
  return function(style) {
    style.walkDecls(function(decl) {
      var value = decl.value;

      if (value && value.indexOf("rebeccapurple") !== -1) {
        decl.value = value.replace(/(rebeccapurple)\b/gi, color)
      }
    })
  }
})
