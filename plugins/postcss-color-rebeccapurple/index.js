/**
 * Module dependencies.
 */
var color = require("color")

/**
 * PostCSS plugin to convert colors
 *
 * @param {Object} options
 */
module.exports = function plugin(options) {
  options = options || {}
  options.rebeccapurple = options.rebeccapurple !== undefined ? options.rebeccapurple : true
  options.hwb = options.hwb !== undefined ? options.hwb : true
  options.hexAlpha = options.hexAlpha !== undefined ? options.hexAlpha : true
  options.color = options.color !== undefined ? options.color : true

  return function(style) {
    style.eachDecl(function transformDecl(dec) {
      if (!dec.value) {
        return
      }

      dec.value = transform(dec.value, dec.source, options)
    })
  }
}

/**
 * Transform colors to rgb() or rgba() on a declaration value
 *
 * @param {String} string
 * @return {String}
 */
function transform(string, source, options) {
  // order of transformation is important

  try {
    if (options.rebeccapurple && string.indexOf("rebeccapurple") > -1) {
      string = transformRebeccapurple(string, source)
    }
  }
  catch (e) {
    throw new Error(gnuMessage(e.message, source))
  }

  return string
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

/**
 * return GNU style message
 *
 * @param {String} message
 * @param {Object} source
 */
function gnuMessage(message, source) {
  return (source ? (source.file ? source.file : "<css input>") + ":" + source.start.line + ":" + source.start.column : "") + " " + message
}
