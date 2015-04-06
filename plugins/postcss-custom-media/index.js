/**
 * Module dependencies
 */
var postcss = require("postcss")
var helpers = require("postcss-message-helpers")

/**
 * Constants.
 */
var EXTENSION_RE = /\(\s*(--[\w-]+)\s*\)/g

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
    var append = options.append
    var preserve = append || options.preserve
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

      if (!preserve) {
        toRemove.push(rule)
      }
    })

    // apply js-defined media queries
    Object.keys(extensions).forEach(function(name) {
      map[name] = extensions[name]
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

        console.warn(helpers.message("missing @custom-media definition for '" + name + "'. The entire rule has been removed from the output.", rule.source))
        toRemove.push(rule)
      })
    })

    if (append) {
      var names = Object.keys(map)
      if (names.length) {
        names.forEach(function(name) {
          var atRule = postcss.atRule({
            name: "custom-media",
            afterName: " ",
            params: name + " " + map[name],
          })
          styles.append(atRule)
        })
        styles.semicolon = true
        styles.after = "\n"
      }
    }

    // remove @custom-media
    toRemove.forEach(function(rule) { rule.removeSelf() })
  }
}
