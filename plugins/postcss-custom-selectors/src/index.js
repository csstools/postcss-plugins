import postcss from "postcss"
import replaceRuleSelector
  from "postcss-selector-matches/dist/replaceRuleSelector"

const CUSTOM_SELECTOR_RE = /:--[\w-]+/g

export default postcss.plugin("postcss-custom-selectors", function(options) {
  const {
    extensions,
    lineBreak,
    transformMatches,
  } = {
    extensions: {},
    lineBreak: true,
    transformMatches: true,
    ...options || {},
  }

  const transformMatchesOnRule = transformMatches
    ? (rule) => replaceRuleSelector(rule, {
        lineBreak,
      })
    : (rule) => rule.selector

  return function(css, result) {
    const toRemove = []
    const customSelectors = {}

    // first, read custom selectors
    css.eachAtRule(function(rule) {
      if (rule.name !== "custom-selector") {
        return
      }

      // @custom-selector = @custom-selector <extension-name> <selector>
      const params = rule.params.split(/\s/)
      const customName = params.shift()
      const customList = rule.params.replace(customName, "").trim()
      customSelectors[customName] = customList

      toRemove.push(rule)
    })

    // Add JS defined selectors
    Object.keys(extensions).forEach(function(extension) {
      customSelectors[extension] = extensions[extension]
    })

    // Convert those selectors to :matches()
    css.eachRule(function(rule) {
      if (rule.selector.indexOf(":--") > -1) {
        rule.selector = rule.selector.replace(
          CUSTOM_SELECTOR_RE,
          function(extensionName, matches, selector) {

            if (!customSelectors[extensionName]) {
              result.warn(
                "The selector '" + rule.selector + "' is undefined",
                {node: rule}
              )

              return selector
            }

            return ":matches(" + customSelectors[extensionName] + ")"
          }
        )

        rule.selector = transformMatchesOnRule(rule)
      }
    })

    toRemove.forEach(function(rule) {
      rule.removeSelf()
    })

  }
})
