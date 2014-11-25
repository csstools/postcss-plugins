/**
 * Module dependencies.
 */
var color = require("color")
var helpers = require("postcss-message-helpers")

/**
 * PostCSS plugin to convert colors
 */
module.exports = function plugin() {
  return function(style) {
    style.eachDecl(function transformDecl(decl) {
      if (!decl.value || decl.value.indexOf("rebeccapurple") === -1) {
        return
      }

      decl.value = helpers.try(function transformRebeccapurpleValue() {
        return transformRebeccapurple(decl.value)
      }, decl.source)
    })
  }
}


/**
 * Transform rebeccapurple color to rgb()
 *
 * @param  {String} string declaration value
 * @return {String}        converted declaration value to rgba()
 */
function transformRebeccapurple(string) {
  return string.replace(/(rebeccapurple)\b/gi, color("rebeccapurple").rgbString())
}
