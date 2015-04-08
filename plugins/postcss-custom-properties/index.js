/**
 * Module dependencies.
 */

var assign = require("object-assign")
var postcss = require("postcss")
var balanced = require("balanced-match")
var helpers = require("postcss-message-helpers")

/**
 * Constants.
 */

var VAR_PROP_IDENTIFIER = "--"
var VAR_FUNC_IDENTIFIER = "var"
var RE_VAR = /([\w-]+)(?:\s*,\s*)?(.*)?/ // matches `name[, fallback]`, captures "name" and "fallback"

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

  var start = value.indexOf(VAR_FUNC_IDENTIFIER + "(")
  if (start === -1) {
    return [value]
  }

  var matches = balanced("(", ")", value.substring(start))

  if (!matches) {
    throw new SyntaxError("missing closing ')' in the value '" + value + "'")
  }

  if (matches.body === "") {
    throw new Error("var() must contain a non-whitespace string")
  }

  matches.body.replace(RE_VAR, function(_, name, fallback) {
    var variable = variables[name]
    var post
    // undefined and without fallback, just keep original value
    if (!variable && !fallback) {
      console.warn(helpers.message("variable '" + name + "' is undefined and used without a fallback", source))
      post = matches.post ? resolveValue(matches.post, variables, source) : [""]
      // resolve the end of the expression
      post.forEach(function(afterValue) {
        results.push(value.slice(0, start) + VAR_FUNC_IDENTIFIER + "(" + name + ")" + afterValue)
      })
      return
    }

    // prepend with fallbacks
    if (fallback) {
      // resolve fallback values
      fallback = resolveValue(fallback, variables, source)
      // resolve the end of the expression before the rest
      post = matches.post ? resolveValue(matches.post, variables, source) : [""]
      fallback.forEach(function(fbValue) {
        post.forEach(function(afterValue) {
          results.push(value.slice(0, start) + fbValue + afterValue)
        })
      })
    }

    if (!variable) {
      return
    }

    // replace with computed custom properties
    if (!variable.resolved) {
      // circular reference encountered
      if (variable.deps.indexOf(name) !== -1) {
        if (!fallback) {
          console.warn(helpers.message("circular variable reference: " + name, source))
          variable.value = [variable.value]
          variable.circular = true
        }
        else {
          variable.value = fallback
          return
        }
      }
      else {
        variable.deps.push(name)
        variable.value = resolveValue(variable.value, variables, source)
      }
      variable.resolved = true
    }
    if (variable.circular && fallback) {
      return
    }
    // resolve the end of the expression
    post = matches.post ? resolveValue(matches.post, variables, source) : [""]
    variable.value.forEach(function(replacementValue) {
      post.forEach(function(afterValue) {
        results.push(value.slice(0, start) + replacementValue + afterValue)
      })
    })
  })

  return results
}

/**
 * Module export.
 */

module.exports = function(options) {
  return function(style) {
    options = options || {}
    var variables = assign({}, options.variables || {})
    Object.keys(variables).forEach(function(name) {
      if (name.slice(0, 2) !== "--") {
        variables["--" + name] = variables[name]
        delete variables[name]
      }
    })
    var strict = options.strict === undefined ? true : options.strict
    var appendVariables = options.appendVariables
    var preserve = options.preserve
    var map = {}
    var importantMap = {}

    // define variables
    style.eachRule(function(rule) {
      var toRemove = []

      // only variables declared for `:root` are supported for now
      if (rule.selectors.length !== 1 || rule.selectors[0] !== ":root" || rule.parent.type !== "root") {
        rule.each(function(decl) {
          var prop = decl.prop
          if (prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
            console.warn(
              helpers.message(
                "Custom property ignored: not scoped to the top-level :root element (" +
                rule.selectors +
                " { ... " + prop + ": ... })" +
                (rule.parent.type !== "root" ? ", in " + rule.parent.type : ""),
              decl.source)
            )
          }
        })
        return
      }

      rule.each(function(decl, index) {
        var prop = decl.prop
        if (prop && prop.indexOf(VAR_PROP_IDENTIFIER) === 0) {
          if (!map[prop] || !importantMap[prop] || decl.important) {
            map[prop] = {
              value: decl.value,
              deps: [],
              circular: false,
              resolved: false,
            }
            importantMap[prop] = decl.important
          }
          toRemove.push(index)
        }
      })

      // optionally remove `--*` properties from the rule
      if (!preserve) {
        for (var i = toRemove.length - 1; i >= 0; i--) {
          rule.nodes.splice(toRemove[i], 1)
        }

        // remove empty :root {}
        if (rule.nodes.length === 0) {
          rule.removeSelf()
        }
      }
    })

    // apply js-defined custom properties
    Object.keys(variables).forEach(function(variable) {
      map[variable] = {
        value: variables[variable],
        deps: [],
        circular: false,
        resolved: false,
      }
    })

    if (preserve) {
      Object.keys(map).forEach(function(name) {
        var variable = map[name]
        if (!variable.resolved) {
          variable.value = resolveValue(variable.value, map)
          variable.resolved = true
        }
      })
    }

    // resolve variables
    style.eachDecl(function(decl) {
      var value = decl.value

      // skip values that don’t contain variable functions
      if (!value || value.indexOf(VAR_FUNC_IDENTIFIER + "(") === -1) {
        return
      }

      helpers.try(function resolve() {
        var resolved = resolveValue(value, map, decl.source)
        if (!strict) {
          resolved = [resolved.pop()]
        }
        resolved.forEach(function(resolvedValue) {
          var clone = decl.cloneBefore()
          clone.value = resolvedValue
        })
      }, decl.source)

      if (!preserve || preserve === "computed") {
        decl.removeSelf()
      }
    })

    if (preserve && appendVariables) {
      var names = Object.keys(map)
      if (names.length) {
        var container = postcss.rule({
          selector: ":root",
          semicolon: true,
        })
        names.forEach(function(name) {
          var variable = map[name]
          var val = variable.value
          if (variable.resolved) { val = val[val.length - 1] }
          var decl = postcss.decl({
            prop: name,
            value: val,
          })
          container.append(decl)
        })
        style.append(container)
      }
    }
  }
}
