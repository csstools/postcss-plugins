import postcss from "postcss"
import balanced from "balanced-match"

const VAR_PROP_IDENTIFIER = "--"
const VAR_FUNC_IDENTIFIER = "var"
const VAR_FUNC_REGEX = /(^|[^\w-])var\(/
// matches `name[, fallback]`, captures "name" and "fallback"
const RE_VAR = /[\f\n\r\t ]*([\w-]+)(?:[\f\n\r\t ]*,[\f\n\r\t ]*([\W\w]+))?/

/**
 * Module variables
 */

let globalOpts

/**
 * Resolve CSS variables.
 *
 * The second argument to the CSS variable function, var(name[, fallback]),
 * is used in the event that first argument cannot be resolved.
 *
 * @param {String} value May contain the CSS variable function
 * @param {Object} variables A map of variable names and values
 * @param {Object} result The PostCSS result object
 * @param {Object} decl The declaration containing the rule
 * @return {String} A property value with all CSS variables substituted.
 */
function resolveValue(value, variables, result, decl) {
  const results = []

  const hasVarFunction = VAR_FUNC_REGEX.test(value)

  if (!hasVarFunction) {
    return [value]
  }

  const match = value.match(VAR_FUNC_REGEX)
  const start = match.index + match[1].length

  const matches = balanced("(", ")", value.substring(start))

  if (!matches) {
    throw decl.error(`missing closing ')' in the value '${value}'`)
  }

  if (matches.body === "") {
    throw decl.error("var() must contain a non-whitespace string")
  }

  matches.body.replace(RE_VAR, function(_, name, fallback) {
    const variable = variables[name]
    let post
    // undefined and without fallback, just keep original value
    if (!variable && !fallback) {
      if (globalOpts.warnings) {
        const errorStr =
          `variable '${name}' is undefined and used without a fallback`

        if (globalOpts.noValueNotifications === "error") {
          throw decl.error(errorStr, {word: name})
        }
        else {
          result.warn(errorStr, {node: decl})
        }
      }
      post = matches.post
        ? resolveValue(matches.post, variables, result, decl)
        : [""]
      // resolve the end of the expression
      post.forEach(function(afterValue) {
        results.push(
          value.slice(0, start) +
          VAR_FUNC_IDENTIFIER + "(" + name + ")" + afterValue
        )
      })
      return
    }

    // prepend with fallbacks
    if (fallback) {
      // resolve fallback values
      fallback = resolveValue(fallback, variables, result, decl)
      // resolve the end of the expression before the rest
      post = matches.post
        ? resolveValue(matches.post, variables, result, decl)
        : [""]
      fallback.forEach((fbValue) => {
        post.forEach((afterValue) => {
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
          if (globalOpts.warnings) {
            result.warn("Circular variable reference: " + name, {node: decl})
          }
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
        variable.value = resolveValue(variable.value, variables, result, decl)
      }
      variable.resolved = true
    }
    if (variable.circular && fallback) {
      return
    }
    // resolve the end of the expression
    post = matches.post
      ? resolveValue(matches.post, variables, result, decl)
      : [""]
    variable.value.forEach((replacementValue) => {
      post.forEach((afterValue) => {
        results.push(value.slice(0, start) + replacementValue + afterValue)
      })
    })
  })

  return results
}

function prefixVariables(variables) {
  const prefixedVariables = {}

  if (!variables) {
    return prefixedVariables
  }

  Object.keys(variables).forEach((name) => {
    const val = variables[name]
    if (name.slice(0, 2) !== "--") {
      name = "--" + name
    }
    prefixedVariables[name] = String(val)
  })

  return prefixedVariables
}

/**
 * Module export.
 */
export default postcss.plugin("postcss-custom-properties", (options = {}) => {

  function setVariables(variables) {
    options.variables = prefixVariables(variables)
  }

  function plugin(style, result) {
    const variables = prefixVariables(options.variables)
    const strict = options.strict === undefined ? true : options.strict
    const appendVariables = options.appendVariables
    const preserve = options.preserve
    const map = {}
    const importantMap = {}

    globalOpts = {
      warnings: options.warnings === undefined ? true : options.warnings,
      noValueNotifications: options.noValueNotifications || "warning",
    }

    // define variables
    style.walkRules((rule) => {
      const toRemove = []

      // only variables declared for `:root` are supported for now
      if (
        rule.selectors.length !== 1 ||
        rule.selectors[0] !== ":root" ||
        rule.parent.type !== "root"
      ) {
        rule.each((decl) => {
          const prop = decl.prop
          if (
            globalOpts.warnings &&
            prop &&
            prop.indexOf(VAR_PROP_IDENTIFIER) === 0
          ) {
            result.warn(
              "Custom property ignored: not scoped to the top-level :root " +
              `element (${rule.selectors} { ... ${prop}: ... })` +
              (rule.parent.type !== "root" ? ", in " + rule.parent.type : ""),
              {node: decl}
            )
          }
        })
        return
      }

      rule.each((decl, index) => {
        const prop = decl.prop
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
        for (let i = toRemove.length - 1; i >= 0; i--) {
          rule.nodes.splice(toRemove[i], 1)
        }

        // remove empty :root {}
        if (rule.nodes.length === 0) {
          rule.remove()
        }
      }
    })

    // apply js-defined custom properties
    Object.keys(variables).forEach((variable) => {
      map[variable] = {
        value: variables[variable],
        deps: [],
        circular: false,
        resolved: false,
      }
    })

    if (preserve) {
      Object.keys(map).forEach((name) => {
        const variable = map[name]
        if (!variable.resolved) {
          variable.value = resolveValue(variable.value, map, result)
          variable.resolved = true
        }
      })
    }

    // resolve variables
    style.walkDecls((decl) => {
      const value = decl.raws.value ? decl.raws.value.raw : decl.value

      // skip values that don’t contain variable functions
      if (!value || value.indexOf(VAR_FUNC_IDENTIFIER + "(") === -1) {
        return
      }

      let resolved = resolveValue(value, map, result, decl)
      if (!strict) {
        resolved = [resolved.pop()]
      }
      resolved.forEach((resolvedValue) => {
        const clone = decl.cloneBefore()
        clone.value = resolvedValue
      })

      if (!preserve || preserve === "computed") {
        decl.remove()
      }
    })

    if (preserve && appendVariables) {
      const names = Object.keys(map)
      if (names.length) {
        const container = postcss.rule({
          selector: ":root",
          raws: {semicolon: true},
        })
        names.forEach((name) => {
          const variable = map[name]
          let val = variable.value
          if (variable.resolved) {
            val = val[val.length - 1]
          }
          const decl = postcss.decl({
            prop: name,
            value: val,
          })
          container.append(decl)
        })
        style.append(container)
      }
    }
  }

  plugin.setVariables = setVariables

  return plugin
})
