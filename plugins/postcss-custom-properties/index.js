/**
 * Module dependencies.
 */

var balanced = require("balanced-match")

/**
 * Constants.
 */

var VAR_PROP_IDENTIFIER = "--"
var VAR_FUNC_IDENTIFIER = "var"
var RE_VAR = /([\w-]+)(?:\s*,\s*)?(.*)?/ // matches `name[, fallback]`, captures "name" and "fallback"

/**
 * Module export.
 */

module.exports = function(options) {
  return function(style) {
    options = options || {}
    var variables = options.variables || {}
    var preserve = (options.preserve === true ? true : false)
    var map = {}

    // define variables
    style.eachRule(function(rule) {
      var toRemove = []
      if (rule.type !== "rule") {
        return
      }

      // only variables declared for `:root` are supported for now
      if (rule.selectors.length !== 1 || rule.selectors[0] !== ":root" || rule.parent.type !== "root") {
        return
      }

      rule.each(function(decl, i) {
        var prop = decl.prop
        var value = decl.value

        if (prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
          map[prop] = value
          toRemove.push(i)
        }
      })

      // optionally remove `--*` properties from the rule
      if (!preserve) {
        for (var i = toRemove.length - 1; i >= 0; i--) {
          rule.decls.splice(toRemove[i], 1)
        }

        // remove empty :root {}
        if (rule.decls.length === 0) {
          rule.removeSelf()
        }
      }
    })

    // apply js-defined custom properties
    Object.keys(variables).forEach(function(variable) {
      map[variable] = variables[variable]
    })

    // resolve variables
    style.eachDecl(function(decl) {
      var value = decl.value

      // skip values that don’t contain variable functions
      if (!value || value.indexOf(VAR_FUNC_IDENTIFIER + "(") === -1) {
        return
      }

      resolveValue(value, map, decl.source).forEach(function(resolvedValue) {
        var clone = decl.clone()
        clone.value = resolvedValue
        decl.parent.insertBefore(decl, clone)
      })

      if (!preserve) {
        decl.removeSelf()
      }
    })
  }
}

/**
 * Resolve CSS variables in a value
 *
 * The second argument to a CSS variable function, if provided, is a fallback
 * value, which is used as the substitution value when the referenced variable
 * is invalid.
 *
 * var(name[, fallback])
 *
 * @param {String} value A property value known to contain CSS variable functions
 * @param {Object} variables A map of variable names and values
 * @param {Object} source source object of the declaration containing the rule
 * @return {String} A property value with all CSS variables substituted.
 */

function resolveValue(value, variables, source) {
  var results = []

  var start = value.indexOf("var(")
  if (start === -1) {
    return [value]
  }

  var matches = balanced("(", ")", value.substring(start))

  if (!matches) {
    throw new SyntaxError(gnuMessage("missing closing ')' in the value '" + value + "'", source))
  }

  if (matches.body === "") {
    throw new Error(gnuMessage("var() must contain a non-whitespace string", source))
  }

  matches.body.replace(RE_VAR, function(_, name, fallback) {
    var replacement = variables[name]
    if (!replacement && !fallback) {
      console.warn(gnuMessage("variable '" + name + "' is undefined and used without a fallback", source))
    }

    // prepend with fallbacks
    if (fallback) {
      // resolve the end of the expression before the rest
      (matches.post ? resolveValue(matches.post, variables, source) : [""]).forEach(function(afterValue) {
        // resolve fallback values
        resolveValue(fallback, variables, source).forEach(function(fbValue) {
          results.push(value.slice(0, start) + fbValue + afterValue)
        })
      })
    }

    // replace with computed custom properties
    if (replacement) {
      // resolve the end of the expression
      (matches.post ? resolveValue(matches.post, variables, source) : [""]).forEach(function(afterValue) {
        // resolve replacement if it use a custom property
        resolveValue(replacement, variables, source).forEach(function(replacementValue) {
          results.push(value.slice(0, start) + replacementValue + afterValue)
        })
      })
    }

    // nothing, just keep original value
    if (!replacement && !fallback) {
      // resolve the end of the expression
      (matches.post ? resolveValue(matches.post, variables, source) : [""]).forEach(function(afterValue) {
        results.push(value.slice(0, start) + value + afterValue)
      })
    }
  })

  return results
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
