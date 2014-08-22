/**
 * Module dependencies.
 */

var balanced = require("balanced-match")

/**
 * Constants.
 */

var VAR_PROP_IDENTIFIER = "--"
var VAR_FUNC_IDENTIFIER = "var"

/**
 * Module export.
 */

module.exports = function(options) {
  return function(style) {
    options = options || {}
    var map = options.map || {}
    var preserve = (options.preserve === true ? true : false)

    // define variables
    style.eachRule(function(rule) {
      var varNameIndices = []
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
          varNameIndices.push(i)
        }
      })

      // optionally remove `--*` properties from the rule
      if (!preserve) {
        for (var i = varNameIndices.length - 1; i >= 0; i--) {
          rule.decls.splice(varNameIndices[i], 1)
        }

        // remove empty :root {}
        if (rule.decls.length === 0) {
          rule.removeSelf()
        }
      }
    })

    // resolve variables
    style.eachDecl(function(decl) {
      var resolvedValue
      var value = decl.value

      // skip values that don’t contain variable functions
      if (!value || value.indexOf(VAR_FUNC_IDENTIFIER + "(") === -1) {
        return
      }

      resolvedValue = resolveValue(value, map, decl.source)

      if (!preserve) {
        decl.value = resolvedValue
      }
      else {
        decl.parent.insertBefore(decl, {
          prop: decl.prop,
          value: resolvedValue
        })
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
 * @param {Object} map A map of variable names and values
 * @param {Object} source source object of the declaration containing the rule
 * @return {String} A property value with all CSS variables substituted.
 */

function resolveValue(value, map, source) {
  // matches `name[, fallback]`, captures "name" and "fallback"
  var RE_VAR = /([\w-]+)(?:\s*,\s*)?(.*)?/
  var balancedParens = balanced("(", ")", value)
  var varStartIndex = value.indexOf("var(")

  if (!balancedParens) {
    throw new SyntaxError(gnuMessage("missing closing ')' in the value '" + value + "'", source))
  }

  var varRef = balanced("(", ")", value.substring(varStartIndex)).body
  if (varRef === "") {
    throw new Error(gnuMessage("var() must contain a non-whitespace string", source))
  }

  var varFunc = VAR_FUNC_IDENTIFIER + "(" + varRef + ")"

  var varResult = varRef.replace(RE_VAR, function(_, name, fallback) {
    var replacement = map[name]
    if (!replacement && !fallback) {
      throw new Error(gnuMessage("variable '" + name + "' is undefined", source))
    }
    if (!replacement && fallback) {
      return fallback
    }
    return replacement
  })

  // resolve the variable
  value = value.split(varFunc).join(varResult)

  // recursively resolve any remaining variables in the value
  if (value.indexOf(VAR_FUNC_IDENTIFIER) !== -1) {
    value = resolveValue(value, map)
  }

  return value
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
