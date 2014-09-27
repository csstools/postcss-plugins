/**
 * Constants.
 */
var EXTENSION_RE = /\(\s*(--[\w-]+)\s*\)/

/**
 * Expose the plugin.
 */
module.exports = customMedia

/**
 * read & replace custom media queries by standard media queries
 */
function customMedia(options) {
  return function(styles) {
    options = options || {}
    var extensions = options.extensions || {}
    var map = {}
    var toRemove = []

    // read custom media queries
    styles.eachAtRule(function(rule) {
      if (rule.name !== "custom-media") {
        return
      }

      var params = rule.params.split(" ")
      // @custom-media <extension-name> <media-query-list>;
      // map[<extension-name>] = <media-query-list>
      map[params.shift()] = params.join(" ")

      toRemove.push(rule)
    })

    // apply js-defined media queries
    Object.keys(extensions).forEach(function(extension) {
      map[extension] = extensions[extension]
    })

    // transform custom media query aliases
    styles.eachAtRule(function(rule) {
      if (rule.name !== "media") {
        return
      }

      rule.params = rule.params.replace(EXTENSION_RE, function(_, name) {
        if (map[name]) {
          return map[name]
        }

        console.warn(gnuMessage("missing @custom-media definition for '" + name + "'. The entire rule has been removed from the output.", rule.source))
        toRemove.push(rule)
      })
    })

    // remove @custom-media
    toRemove.forEach(function(rule) { rule.removeSelf() })
  }
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
